export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  return res.status(200).json({
    data: [
      {
        id: "DUMMY-001",
        customerName: "Test User",
        phone: "998901234567",
        total: 1000000,
        status: "Kutilmoqda",
        date: new Date().toISOString().split('T')[0],
        paymentMethod: "Naqd"
      }
    ]
  });
}
