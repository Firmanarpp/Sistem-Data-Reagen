// @ts-ignore: Deno global is available in Deno runtime
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
// @ts-ignore: Deno import from URL
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// @ts-ignore: Deno global is available in Deno runtime
serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, reagentName, transactionType, amount, oldStock, newStock, unit, notes } = await req.json()

    // Create Supabase Admin Client
    // @ts-ignore: Deno global is available in Deno runtime
    const supabaseAdmin = createClient(
      // @ts-ignore: Deno global is available in Deno runtime
      Deno.env.get('SUPABASE_URL') ?? '',
      // @ts-ignore: Deno global is available in Deno runtime
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Format email content
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9f9f9; padding: 20px; border: 1px solid #e0e0e0; border-radius: 0 0 8px 8px; }
          .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #667eea; border-radius: 4px; }
          .info-row { display: flex; margin: 8px 0; }
          .info-label { font-weight: bold; min-width: 140px; color: #555; }
          .info-value { color: #333; }
          .highlight { color: #667eea; font-weight: bold; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h2 style="margin: 0;">📦 Notifikasi Perubahan Stok</h2>
            <p style="margin: 5px 0 0 0; opacity: 0.9;">PharmStock - Sistem Manajemen Reagen</p>
          </div>
          <div class="content">
            <p>Transaksi stok telah berhasil dilakukan:</p>
            
            <div class="info-box">
              <div class="info-row">
                <div class="info-label">🧪 Nama Reagen:</div>
                <div class="info-value"><strong>${reagentName}</strong></div>
              </div>
              <div class="info-row">
                <div class="info-label">📋 Jenis Transaksi:</div>
                <div class="info-value"><span class="highlight">${transactionType}</span></div>
              </div>
              <div class="info-row">
                <div class="info-label">📊 Jumlah:</div>
                <div class="info-value">${amount} ${unit}</div>
              </div>
              <div class="info-row">
                <div class="info-label">📉 Stok Sebelumnya:</div>
                <div class="info-value">${oldStock} ${unit}</div>
              </div>
              <div class="info-row">
                <div class="info-label">📈 Stok Sekarang:</div>
                <div class="info-value"><strong>${newStock} ${unit}</strong></div>
              </div>
              ${notes !== '-' ? `
              <div class="info-row">
                <div class="info-label">📝 Catatan:</div>
                <div class="info-value">${notes}</div>
              </div>
              ` : ''}
            </div>
            
            <p style="margin-top: 20px; color: #666; font-size: 14px;">
              <em>Email ini dikirim secara otomatis oleh sistem PharmStock.</em>
            </p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PharmStock. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `

    // Send email using Supabase Auth Admin API
    const { data, error } = await supabaseAdmin.auth.admin.sendEmail(
      to,
      {
        subject: `🔔 Notifikasi Stok: ${reagentName}`,
        html: emailHtml,
      }
    )

    if (error) {
      console.error('Error sending email:', error)
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      )
    }

    return new Response(
      JSON.stringify({ success: true, data }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
