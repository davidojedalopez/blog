const fetch = require('node-fetch');
const flatcache = require("flat-cache");
const path = require("path");
const matter = require('gray-matter');
const fs = require('fs');

importPosts();

function getDateKey() {
	let date = new Date();
	return `${date.getUTCFullYear()}-${date.getUTCMonth() + 1}-${date.getUTCDate()}`;
}

async function importPosts() {
  console.info("Getting DEV posts");
  
  let cache = flatcache.load('dev-posts', path.resolve('./_datacache'));
  let key = getDateKey();
  let cachedData = cache.getKey(key);
  
  if(cachedData) {
    let response = await fetch("https://dev.to/api/articles/me/published", {
      headers: {'api-key':process.env.DEV_API_KEY},
      method: 'get'
    });
    let json = await response.json();
    cache.setKey(key, json)
    cache.save()

    for(article of json) {      
      let markdown = article.body_markdown;
      let originalTitle = article.title;
      
      article = cleanArticle(article);      
      if(article.title === 'aws-s3-the-basics' || article.title === 'on-handling-outages-a-case-study') {
        continue;
      }
      let post = matter.stringify(markdown, article);            
      fs.writeFile(`posts/${article.published_at}_${article.title}.md`, post, (error) => {
        if(error) {
          console.error(error);
          throw error;
        }        
      })
    }

    console.info(`${json.length} posts from DEV imported`);
  }
    
  return {
    posts: cachedData
  }
}

function cleanArticle(article) {
  delete article.body_markdown;
  delete article.user;
  delete article.organization;
  delete article.flare_tag;

  article.title = article.title
        .replace(/\s+/g, '-')
        .replace(/[^a-zA-Z0-9-]/g, '')
        .toLowerCase()
  article.published_at = article.published_at.split('T')[0];

  return article;
}