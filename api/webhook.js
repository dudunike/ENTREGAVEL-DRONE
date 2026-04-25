// api/webhook.js
// Este arquivo será o receptor do ggCheckout
// URL: https://entregavel-drone.vercel.app/api/webhook

export default async function handler(req, res) {
    if (req.method === 'POST') {
        try {
            const body = req.body;
            
            // O ggCheckout envia o e-mail do cliente no campo 'email'
            // E o status da venda no campo 'status' (geralmente 'paid' ou 'approved')
            const customerEmail = body.email || body.customer?.email;
            const status = body.status || body.event;

            // Log para debug no painel da Vercel
            console.log('Recebido Webhook:', customerEmail, status);

            if (status === 'paid' || status === 'approved' || status === 'pix_paid' || status === 'card_paid') {
                // AQUI: Você deve conectar com seu Banco de Dados (Supabase/Firebase)
                // Exemplo: await supabase.from('allowed_emails').insert({ email: customerEmail });
                
                return res.status(200).json({ message: 'Acesso liberado para ' + customerEmail });
            }

            return res.status(200).json({ message: 'Evento recebido, mas não é de pagamento aprovado.' });
        } catch (error) {
            console.error('Erro no Webhook:', error);
            return res.status(500).json({ error: 'Erro interno ao processar o webhook.' });
        }
    } else {
        res.setHeader('Allow', 'POST');
        res.status(405).end('Method Not Allowed');
    }
}
