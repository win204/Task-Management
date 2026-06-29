async function test() {
  try {
    const loginRes = await fetch('http://localhost:8080/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password: '123123' })
    });
    const loginData = await loginRes.json();
    console.log('Login Response:', loginData);
    const token = loginData.data?.accessToken;
    if (!token) {
        console.error('No token found');
        return;
    }

    const res = await fetch('http://localhost:8080/api/activity-logs/search?module=PROJECT', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const resData = await res.json();
    console.log('PROJECT module results:', resData.data.content.length);

    const res2 = await fetch('http://localhost:8080/api/activity-logs/search?action=CREATE', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const resData2 = await res2.json();
    console.log('Action=CREATE results:', resData2.data.content.length);

    const res3 = await fetch('http://localhost:8080/api/activity-logs/search', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const resData3 = await res3.json();
    console.log('Total results:', resData3.data.content);
    const res4 = await fetch('http://localhost:8080/api/activity-logs/search?result=SUCCESS', {
      headers: { Authorization: `Bearer ${token}` }
    });
    const resData4 = await res4.json();
    console.log('Result=SUCCESS results:', resData4.data.content.length);
  } catch (e) {
    console.error(e.message);
  }
}
test();
