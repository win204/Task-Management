async function test() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '123123' })
    });
    const loginData = await loginRes.json();
    const token = loginData.data.accessToken;

    console.log('--- Test 1: Username search "system" ---');
    let url = 'http://localhost:8080/api/activity-logs/search?username=system';
    let res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    let data = await res.json();
    console.log('Response:', data.success ? data.data.content.length + ' items' : data.message);

    console.log('--- Test 2: Result and IP Address ---');
    url = 'http://localhost:8080/api/activity-logs/search?result=SUCCESS&ipAddress=SYSTEM';
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    data = await res.json();
    console.log('Response:', data.success ? data.data.content.length + ' items' : data.message);

    console.log('--- Test 3: Date offset parsing ---');
    url = 'http://localhost:8080/api/activity-logs/search?startDate=2026-06-28T00:00:00%2B07:00';
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    data = await res.json();
    console.log('Response:', data.success ? data.data.content.length + ' items' : data.message);

    console.log('--- Test 4: Excel export filtered ---');
    url = 'http://localhost:8080/api/export/activity-logs/excel?username=system';
    res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } });
    console.log('Excel response status:', res.status, res.headers.get('content-type'));
  } catch(e) { console.error(e.message); }
}
test();
