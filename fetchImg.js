const https = require('https');
https.get('https://www.cuiatd.edu.pk/faculty/muhammad-ali-faisal/', res => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const match = data.match(/<img[^>]+src="([^"]+)"[^>]*wp-post-image/);
    console.log(match ? match[1] : 'No image found');
  });
});
