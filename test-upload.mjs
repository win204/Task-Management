import fs from 'fs';
import path from 'path';

async function testUploads() {
  const baseUrl = 'http://localhost:8080';
  
  // 1. Login
  const loginRes = await fetch(`${baseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: 'admin', password: 'Admin@123' })
  });
  
  if (!loginRes.ok) {
    console.error('Login failed', await loginRes.text());
    return;
  }
  
  const loginData = await loginRes.json();
  const token = loginData.data.accessToken;
  console.log('Logged in successfully');

  const taskId = 1;

  const { Blob } = await import('buffer');
  
  async function uploadFile(filename, content, type) {
    const formData = new FormData();
    const fileBlob = new Blob([content], { type });
    formData.append('file', fileBlob, filename);

    const res = await fetch(`${baseUrl}/api/attachments/upload?taskId=${taskId}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      console.error(`Upload failed for ${filename}`, await res.text());
      return null;
    }
    const data = await res.json();
    console.log(`Uploaded ${filename} successfully. ID: ${data.data.id}`);
    return data.data;
  }

  const pdf = await uploadFile('test.pdf', 'PDF content', 'application/pdf');
  const docx = await uploadFile('test.docx', 'DOCX content', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
  const png = await uploadFile('test.png', 'PNG content', 'image/png');

  if (!pdf || !docx || !png) {
    console.error('One or more uploads failed.');
    return;
  }

  // Verify list
  const listRes = await fetch(`${baseUrl}/api/attachments/task/${taskId}`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  const listData = await listRes.json();
  console.log(`Found ${listData.data.length} attachments for task ${taskId}`);

  // Download test
  const downloadRes = await fetch(`${baseUrl}/api/attachments/${pdf.id}/download`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (downloadRes.ok) {
    console.log(`Downloaded ${pdf.fileName} successfully.`);
  } else {
    console.error('Download failed', await downloadRes.text());
  }

  // Delete test
  const deleteRes = await fetch(`${baseUrl}/api/attachments/${pdf.id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${token}` }
  });
  if (deleteRes.ok) {
    console.log(`Deleted ${pdf.fileName} successfully.`);
  } else {
    console.error('Delete failed', await deleteRes.text());
  }
}

testUploads().catch(console.error);
