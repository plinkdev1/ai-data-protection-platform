import { Kafka, Producer, Consumer } from 'kafkajs';
import * as amqp from 'amqplib';
import Redis from 'ioredis';

export interface EventEnv {
  KAFKA_BROKERS: string;
  RABBITMQ_URL: string;
  REDIS_URL: string;
}

export interface EventMessage {
  id: string;
  type: string;
  source: string;
  data: any;
  timestamp: Date;
  userId?: string;
  organizationId?: string;
}

export class EventArchitecture {
  private kafka: Kafka | null = null;
  private kafkaProducer: Producer | null = null;
  private kafkaConsumer: Consumer | null = null;
  private rabbitmq: amqp.Connection | null = null;
  private rabbitmqChannel: amqp.Channel | null = null;
  private redis: Redis | null = null;

  constructor(private env: EventEnv) {}

  async initialize(): Promise<void> {
    await Promise.all([
      this.initKafka(),
      this.initRabbitMQ(),
      this.initRedis(),
    ]);
  }

  private async initKafka(): Promise<void> {
    try {
      this.kafka = new Kafka({
        clientId: 'privacyguard-client',
        brokers: this.env.KAFKA_BROKERS.split(','),
        ssl: true,
        sasl: {
          mechanism: 'plain',
          username: process.env.KAFKA_USERNAME || '',
          password: process.env.KAFKA_PASSWORD || '',
        },
      });

      this.kafkaProducer = this.kafka.producer();
      await this.kafkaProducer.connect();

      this.kafkaConsumer = this.kafka.consumer({ groupId: 'privacyguard-group' });
      await this.kafkaConsumer.connect();

      console.log('Kafka initialized successfully');
    } catch (error) {
      console.error('Kafka initialization failed:', error);
    }
  }

  private async initRabbitMQ(): Promise<void> {
    try {
      this.rabbitmq = await amqp.connect(this.env.RABBITMQ_URL);
      this.rabbitmqChannel = await this.rabbitmq.createChannel();
      
      // Create essential queues
      await this.rabbitmqChannel.assertQueue('compliance-tasks', { durable: true });
      await this.rabbitmqChannel.assertQueue('ai-processing', { durable: true });
      await this.rabbitmqChannel.assertQueue('notifications', { durable: true });
      await this.rabbitmqChannel.assertQueue('document-processing', { durable: true });

      console.log('RabbitMQ initialized successfully');
    } catch (error) {
      console.error('RabbitMQ initialization failed:', error);
    }
  }

  private async initRedis(): Promise<void> {
    try {
      this.redis = new Redis(this.env.REDIS_URL);
      await this.redis.ping();
      console.log('Redis initialized successfully');
    } catch (error) {
      console.error('Redis initialization failed:', error);
    }
  }

  // Kafka operations for high-throughput event streaming
  async publishToKafka(topic: string, message: EventMessage): Promise<void> {
    if (!this.kafkaProducer) {
      throw new Error('Kafka producer not initialized');
    }

    await this.kafkaProducer.send({
      topic,
      messages: [{
        key: message.id,
        value: JSON.stringify(message),
        timestamp: message.timestamp.getTime().toString(),
      }],
    });
  }

  async subscribeToKafka(topics: string[], handler: (message: EventMessage) => Promise<void>): Promise<void> {
    if (!this.kafkaConsumer) {
      throw new Error('Kafka consumer not initialized');
    }

    await this.kafkaConsumer.subscribe({ topics });
    
    await this.kafkaConsumer.run({
      eachMessage: async ({ message }) => {
        try {
          const eventMessage: EventMessage = JSON.parse(message.value?.toString() || '{}');
          await handler(eventMessage);
        } catch (error) {
          console.error('Kafka message processing error:', error);
        }
      },
    });
  }

  // RabbitMQ operations for reliable task queuing
  async publishToQueue(queue: string, message: any, options: { priority?: number; delay?: number } = {}): Promise<void> {
    if (!this.rabbitmqChannel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    const messageBuffer = Buffer.from(JSON.stringify(message));
    const publishOptions: any = { persistent: true };

    if (options.priority) {
      publishOptions.priority = options.priority;
    }

    if (options.delay) {
      // Implement delay using RabbitMQ delayed message plugin
      publishOptions.headers = { 'x-delay': options.delay };
    }

    await this.rabbitmqChannel.sendToQueue(queue, messageBuffer, publishOptions);
  }

  async consumeFromQueue(queue: string, handler: (message: any) => Promise<boolean>): Promise<void> {
    if (!this.rabbitmqChannel) {
      throw new Error('RabbitMQ channel not initialized');
    }

    await this.rabbitmqChannel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const message = JSON.parse(msg.content.toString());
          const success = await handler(message);
          
          if (success) {
            this.rabbitmqChannel!.ack(msg);
          } else {
            this.rabbitmqChannel!.nack(msg, false, true); // Requeue
          }
        } catch (error) {
          console.error('Queue message processing error:', error);
          this.rabbitmqChannel!.nack(msg, false, false); // Don't requeue on error
        }
      }
    });
  }

  // Redis operations for caching and session management
  async setCache(key: string, value: any, ttl?: number): Promise<void> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }

    const stringValue = JSON.stringify(value);
    if (ttl) {
      await this.redis.setex(key, ttl, stringValue);
    } else {
      await this.redis.set(key, stringValue);
    }
  }

  async getCache(key: string): Promise<any | null> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }

    const value = await this.redis.get(key);
    return value ? JSON.parse(value) : null;
  }

  async deleteCache(key: string): Promise<void> {
    if (!this.redis) {
      throw new Error('Redis not initialized');
    }
    await this.redis.del(key);
  }

  // Event patterns for compliance workflows
  async publishComplianceEvent(type: 'dpia_created' | 'breach_detected' | 'policy_updated' | 'audit_completed', data: any): Promise<void> {
    const message: EventMessage = {
      id: crypto.randomUUID(),
      type: `compliance.${type}`,
      source: 'compliance-service',
      data,
      timestamp: new Date(),
    };

    await this.publishToKafka('compliance-events', message);
  }

  async publishAIEvent(type: 'processing_started' | 'processing_completed' | 'analysis_ready', data: any): Promise<void> {
    const message: EventMessage = {
      id: crypto.randomUUID(),
      type: `ai.${type}`,
      source: 'ai-service',
      data,
      timestamp: new Date(),
    };

    await this.publishToKafka('ai-events', message);
  }

  async scheduleTask(taskType: string, payload: any, delay: number = 0): Promise<void> {
    await this.publishToQueue('compliance-tasks', {
      id: crypto.randomUUID(),
      type: taskType,
      payload,
      scheduledAt: new Date(),
    }, { delay });
  }

  async healthCheck(): Promise<{
    kafka: boolean;
    rabbitmq: boolean;
    redis: boolean;
  }> {
    const health = {
      kafka: false,
      rabbitmq: false,
      redis: false,
    };

    try {
      if (this.kafkaProducer) {
        // Kafka health check by listing topics
        await this.kafka!.admin().listTopics();
        health.kafka = true;
      }
    } catch (error) {
      console.error('Kafka health check failed:', error);
    }

    try {
      if (this.rabbitmqChannel) {
        await this.rabbitmqChannel.checkQueue('compliance-tasks');
        health.rabbitmq = true;
      }
    } catch (error) {
      console.error('RabbitMQ health check failed:', error);
    }

    try {
      if (this.redis) {
        await this.redis.ping();
        health.redis = true;
      }
    } catch (error) {
      console.error('Redis health check failed:', error);
    }

    return health;
  }

  async cleanup(): Promise<void> {
    try {
      if (this.kafkaProducer) {
        await this.kafkaProducer.disconnect();
      }
      if (this.kafkaConsumer) {
        await this.kafkaConsumer.disconnect();
      }
      if (this.rabbitmq) {
        await this.rabbitmq.close();
      }
      if (this.redis) {
        this.redis.disconnect();
      }
    } catch (error) {
      console.error('Event architecture cleanup error:', error);
    }
  }
}
