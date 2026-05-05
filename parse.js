const fs = require('fs');
const html = fs.readFileSync('scratch.html', 'utf-8');

const items = html.match(/<div class="faculty-item">[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/g) || [];

const parsed = items.map(item => {
    const linkMatch = item.match(/<h3 class="faculty-name"><a href="([^"]+)">([^<]+)<\/a><\/h3>/);
    const imgMatch = item.match(/<img class="profile-image" src="([^"]+)" alt="([^"]*)">/);
    const desigMatch = item.match(/<p class="faculty-designation">([^<]+)<\/p>/);
    const intMatch = item.match(/<div class="interest-content">\s*([\s\S]*?)\s*<\/div>/);
    const hecMatch = item.match(/HEC Approved PhD Supervisor/);

    return {
        name: linkMatch ? linkMatch[2].trim() : '',
        link: linkMatch ? linkMatch[1].trim() : '',
        image: imgMatch ? imgMatch[1].trim() : '',
        designation: desigMatch ? desigMatch[1].trim() : '',
        interests: intMatch ? intMatch[1].trim().replace(/\s+/g, ' ') : '',
        hecApproved: !!hecMatch
    };
});

fs.writeFileSync('facultyData.json', JSON.stringify(parsed, null, 2));
console.log('done', parsed.length);
