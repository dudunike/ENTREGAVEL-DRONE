import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
)

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const body = req.body;
            const customerEmail = (body.email || body.customer?.email || '').toLowerCase().trim();
            const status = body.status || body.event;

            console.log('Webhook recebido:', customerEmail, status);

            if (status === 'paid' || status === 'approved' || status === 'pix_paid' || status === 'card_paid') {
                const { data, error } = await supabase
                    .from('allowed_emails')
                    .insert([{ email: customerEmail }]);

                if (error && error.code !== '23505') { // Ignora erro de e-mail duplicado
                    console.error('Erro Supabase:', error);
                    return res.status(500).json({ error: 'Erro ao salvar e-mail.' });
                }
                
                return res.status(200).json({ message: 'Acesso liberado!' });
            }

            return res.status(200).json({ message: 'Evento processado.' });
        } catch (error) {
            return res.status(500).json({ error: error.message });
        }
    }
    res.status(405).end();
}
