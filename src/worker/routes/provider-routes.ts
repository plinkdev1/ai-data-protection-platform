import { Hono } from 'hono';
import { z } from 'zod';

type Bindings = {
  DB: D1Database;
  MOCHA_USERS_SERVICE_API_KEY: string;
  MOCHA_USERS_SERVICE_API_URL: string;
};

const app = new Hono<{ Bindings: Bindings }>();

// Get provider service requests
app.get('/service-requests', async (c) => {
  const status = c.req.query('status');
  const isProvider = c.req.query('provider') === 'true';
  
  try {
    let query = `
      SELECT 
        sr.*,
        o.name as organization_name,
        ms.name as service_name
      FROM service_requests sr
      LEFT JOIN organizations o ON sr.organization_id = o.id
      LEFT JOIN marketplace_services ms ON sr.service_id = ms.id
    `;
    
    const conditions = [];
    const params: any[] = [];
    
    if (status) {
      if (status === 'active') {
        conditions.push('sr.status IN (?, ?, ?)');
        params.push('pending', 'in_progress', 'assigned');
      } else if (status === 'completed') {
        conditions.push('sr.status = ?');
        params.push('completed');
      }
    }
    
    if (isProvider) {
      // For provider view, show requests assigned to them
      // This would need user authentication to get provider_id
      conditions.push('sr.provider_id IS NOT NULL');
    }
    
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    query += ' ORDER BY sr.created_at DESC';
    
    const result = await c.env.DB.prepare(query).bind(...params).all();
    
    const requests = result.results?.map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      status: row.status,
      priority: row.priority,
      budget: row.budget,
      deadline: row.deadline,
      client_name: row.organization_name || 'Unknown Client',
      service_name: row.service_name,
      created_at: row.created_at,
      updated_at: row.updated_at
    })) || [];
    
    return c.json({ 
      success: true, 
      requests,
      count: requests.length 
    });
    
  } catch (error) {
    console.error('Error fetching provider service requests:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch service requests',
      requests: [],
      count: 0 
    }, 500);
  }
});

// Get provider profile
app.get('/profile', async (c) => {
  try {
    // This would typically use authenticated user ID
    const query = `
      SELECT *
      FROM service_providers
      WHERE status = 'active'
      LIMIT 1
    `;
    
    const result = await c.env.DB.prepare(query).first();
    
    if (!result) {
      return c.json({ 
        success: false, 
        error: 'Provider profile not found' 
      }, 404);
    }
    
    return c.json({ 
      success: true, 
      provider: {
        id: result.id,
        company_name: result.company_name,
        provider_type: result.provider_type,
        specializations: result.specializations,
        hourly_rate: result.hourly_rate,
        availability_hours: result.availability_hours,
        bio: result.bio,
        certifications: result.certifications,
        rating: result.rating,
        total_reviews: result.total_reviews,
        completed_tasks: result.completed_tasks,
        status: result.status
      }
    });
    
  } catch (error) {
    console.error('Error fetching provider profile:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch provider profile' 
    }, 500);
  }
});

// Update provider profile
app.put('/profile', async (c) => {
  try {
    const updateData = await c.req.json();
    
    const updateSchema = z.object({
      company_name: z.string().optional(),
      hourly_rate: z.number().optional(),
      specializations: z.string().optional(),
      bio: z.string().optional(),
      availability_hours: z.string().optional(),
      certifications: z.string().optional()
    });
    
    const validatedData = updateSchema.parse(updateData);
    
    // Build dynamic update query
    const updateFields = Object.keys(validatedData)
      .filter(key => validatedData[key as keyof typeof validatedData] !== undefined)
      .map(key => `${key} = ?`);
    
    if (updateFields.length === 0) {
      return c.json({ 
        success: false, 
        error: 'No fields to update' 
      }, 400);
    }
    
    const updateValues = Object.values(validatedData)
      .filter(value => value !== undefined);
    
    const query = `
      UPDATE service_providers 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE status = 'active'
    `;
    
    await c.env.DB.prepare(query).bind(...updateValues).run();
    
    return c.json({ 
      success: true, 
      message: 'Provider profile updated successfully' 
    });
    
  } catch (error) {
    console.error('Error updating provider profile:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to update provider profile' 
    }, 500);
  }
});

// Get provider statistics
app.get('/stats', async (c) => {
  try {
    // Get active requests count
    const activeResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as count
      FROM service_requests
      WHERE status IN ('pending', 'in_progress', 'assigned')
      AND provider_id IS NOT NULL
    `).first();
    
    // Get completed requests count
    const completedResult = await c.env.DB.prepare(`
      SELECT COUNT(*) as count, SUM(budget) as total_earnings
      FROM service_requests
      WHERE status = 'completed'
      AND provider_id IS NOT NULL
    `).first();
    
    // Get average rating
    const ratingResult = await c.env.DB.prepare(`
      SELECT AVG(rating) as avg_rating
      FROM provider_reviews
      WHERE provider_id = (
        SELECT id FROM service_providers WHERE status = 'active' LIMIT 1
      )
    `).first();
    
    return c.json({
      success: true,
      stats: {
        activeRequests: activeResult?.count || 0,
        completedServices: completedResult?.count || 0,
        totalEarnings: completedResult?.total_earnings || 0,
        rating: ratingResult?.avg_rating || 0,
        responseTime: '< 2 hours'
      }
    });
    
  } catch (error) {
    console.error('Error fetching provider stats:', error);
    return c.json({
      success: false,
      error: 'Failed to fetch provider statistics',
      stats: {
        activeRequests: 0,
        completedServices: 0,
        totalEarnings: 0,
        rating: 0,
        responseTime: '< 2 hours'
      }
    });
  }
});

export default app;
