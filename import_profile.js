const fs = require('fs');
const https = require('https');

const profile = JSON.parse(fs.readFileSync('./abas-profile-export.json', 'utf8'));
const payload = {
  uid: 'ftQr1kAlTsOmZmJZrSzM995eEb73',
  email: 'abasukanga4@gmail.com',
  profileData: profile
};

const url = 'https://importuserprofilefromjson-rsaz7xkotq-uc.a.run.app';
const options = {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  }
};

const req = https.request(url, options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      console.log('Response:', JSON.parse(data));
    } catch {
      console.log('Response:', data);
    }
  });
});

req.on('error', (e) => console.error('Error:', e.message));
req.write(JSON.stringify(payload));
req.end();
