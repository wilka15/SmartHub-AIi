// Этот код выполняется на сервере Vercel, поэтому здесь доступна переменная process.env

export default async function handler(req, res) {
  // Проверяем, что запрос отправлен методом POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const API_URL = 'https://routerai.ru/api/v1/chat/completions';

  try {
    // Перенаправляем запрос на RouterAI, используя секретный ключ из настроек Vercel
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + process.env.ROUTERAI_API_KEY,
      },
      // Тело запроса (то, что ввел пользователь) передаем дальше без изменений
      body: JSON.stringify(req.body),
    });

    // Получаем ответ от RouterAI в виде текста (это важно для сохранения структуры)
    const responseText = await response.text();

    // Устанавливаем заголовок ответа (браузер должен понять, что это JSON)
    res.setHeader('Content-Type', 'application/json');

    // Отправляем ответ пользователю, сохраняя код статуса (200, 401, 500 и т.д.)
    res.status(response.status).send(responseText);

  } catch (error) {
    // Если произошел сбой сети или другая ошибка, выводим её в консоль Vercel
    console.error('Ошибка в серверной функции:', error);
    // Отправляем пользователю сообщение о внутренней ошибке сервера
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
