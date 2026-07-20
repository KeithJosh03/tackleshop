const fetch = require('node-fetch');

async function test() {
    const payload = {
        provider_name: 'google',
        provider_id: '12345',
        name: 'Keith Joshua Salaver',
        email: 'kitjuswa0304@gmail.com',
        avatar_url: 'https://lh3.googleusercontent.com/a/ACg8ocKGoewR7g1aqLsEJVJLA5Gwub5YfNgyjEQ33rAQxXdNxNs-2=s96-c',
    };

    try {
        const res = await fetch('http://localhost:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(payload),
        });

        console.log('Status:', res.status);
        const text = await res.text();
        console.log('Response:', text);
    } catch (err) {
        console.error(err);
    }
}
test();
