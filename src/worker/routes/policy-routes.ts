import { Hono } from 'hono';
import { z } from 'zod';

interface CloudflareBindings {
  DB: D1Database;
  [key: string]: any;
}

const policies = new Hono<{ Bindings: CloudflareBindings }>();

// Add a test endpoint to verify routing
policies.get('/test', async (c) => {
  return c.json({ message: 'Policy routes are working' });
});

const GeneratePolicySchema = z.object({
  policy_id: z.number(),
  format: z.enum(['pdf', 'docx', 'txt']),
  customizations: z.object({
    company_name: z.string().optional(),
    dpo_contact: z.string().optional(),
    company_address: z.string().optional(),
    industry: z.string().optional()
  }).optional()
});

// Generate and download policy document
policies.post('/generate', async (c) => {
  const user = c.get('user');
  if (!user) {
    return c.json({ error: 'Unauthorized' }, 401);
  }

  try {
    const body = await c.req.json();
    const { policy_id, format, customizations } = GeneratePolicySchema.parse(body);

    // Get policy template from database
    const stmt = c.env.DB.prepare(`
      SELECT id, title, template_content 
      FROM policy_catalog 
      WHERE id = ?
    `);
    
    const result = await stmt.bind(policy_id).first();
    if (!result) {
      return c.json({ error: 'Policy template not found' }, 404);
    }

    // Customize the template content with user-provided data
    let customizedContent = result.template_content;
    
    if (customizations) {
      if (customizations.company_name) {
        customizedContent = customizedContent.replace(/\[Company Name\]/g, customizations.company_name);
      }
      if (customizations.dpo_contact) {
        customizedContent = customizedContent.replace(/\[DPO Contact.*?\]/g, customizations.dpo_contact);
        customizedContent = customizedContent.replace(/dpo@company\.com/g, customizations.dpo_contact);
      }
      if (customizations.company_address) {
        customizedContent = customizedContent.replace(/\[Company Address\]/g, customizations.company_address);
      }
      if (customizations.industry) {
        customizedContent = customizedContent.replace(/\[Industry Sector\]/g, customizations.industry);
      }
    }

    // Add current date
    customizedContent = customizedContent.replace(/\[DD\/MM\/YYYY\]/g, new Date().toLocaleDateString());

    const template = {
      title: result.title,
      content: customizedContent
    };

    // Generate document based on format
    let contentType: string;
    let filename: string;
    let content: string | Uint8Array;

    switch (format) {
      case 'txt':
        contentType = 'text/plain';
        filename = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
        content = template.content;
        break;
        
      case 'pdf':
        // For PDF generation, we'd use a library like puppeteer or jsPDF
        // For now, return as text with PDF headers
        contentType = 'application/pdf';
        filename = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`;
        content = template.content; // In production, convert to actual PDF
        break;
        
      case 'docx':
        // For DOCX generation, we'd use a library like docx
        contentType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        filename = `${template.title.replace(/[^a-zA-Z0-9]/g, '_')}.docx`;
        content = template.content; // In production, convert to actual DOCX
        break;
        
      default:
        return c.json({ error: 'Unsupported format' }, 400);
    }

    // Log the download for audit purposes
    const auditStmt = c.env.DB.prepare(`
      INSERT INTO audit_trail (
        user_id,
        action,
        resource_type,
        resource_id,
        details,
        created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `);

    await auditStmt.bind(
      user.id,
      'policy_download',
      'policy_template',
      policy_id.toString(),
      JSON.stringify({
        format,
        template_title: template.title,
        customizations
      })
    ).run();

    // Return the file
    const response = new Response(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Cache-Control': 'no-cache'
      }
    });

    return response;

  } catch (error) {
    console.error('Policy generation failed:', error);
    return c.json({ error: 'Failed to generate policy document' }, 500);
  }
});

// Get policy templates catalog
policies.get('/catalog', async (c) => {
  // Skip authentication check for now to debug
  // const user = c.get('user');
  // if (!user) {
  //   return c.json({ error: 'Unauthorized' }, 401);
  // }

  try {
    // Fetch policies from database
    const stmt = c.env.DB.prepare(`
      SELECT 
        id,
        policy_key,
        title,
        category,
        jurisdiction,
        framework,
        description,
        mandatory_for,
        template_content,
        checklist_items,
        is_featured,
        complexity_level,
        estimated_hours
      FROM policy_catalog 
      ORDER BY is_featured DESC, title ASC
    `);

    const result = await stmt.all();
    
    const catalog = result.results.map((row: any) => ({
      id: row.id,
      policy_key: row.policy_key,
      title: row.title,
      category: row.category,
      jurisdiction: row.jurisdiction,
      framework: row.framework,
      description: row.description,
      mandatory_for: JSON.parse(row.mandatory_for || '[]'),
      template_content: row.template_content,
      checklist_items: JSON.parse(row.checklist_items || '[]'),
      is_featured: Boolean(row.is_featured),
      complexity_level: row.complexity_level,
      estimated_hours: row.estimated_hours
    }));

    return c.json(catalog);
  } catch (error) {
    console.error('Failed to fetch policy catalog:', error);
    return c.json({ error: 'Failed to fetch policy catalog' }, 500);
  }
});

export { policies };
