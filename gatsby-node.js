/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const path = require(`path`);

const makeRequest = (graphql, request) => new Promise((resolve, reject) => {
  // Query for nodes to use in creating pages.
  resolve(
    graphql(request).then(result => {
      if (result.errors) {
        reject(result.errors)
      }
      
      return result;
    })
  )
});

// Implement the Gatsby API “createPages”. This is called once the
// data layer is bootstrapped to let plugins create pages from data.
exports.createPages = ({ actions, graphql }) => {
  const { createPage  } = actions;
  
  const getArticles = makeRequest(graphql, `
    {
        allStrapiNewscategories {
            edges {
              node {
                id
              }
            }
          }
    }
    `).then(result => {
    // Create pages for each article.
    result.data.allStrapiNewscategories.edges.forEach(({ node }) => {
      createPage({
        path: `/news/${node.id}`,
        component: path.resolve(`src/templates/news_details.js`),
        context: {
          id: node.id,
        },
      })
    })
  });

  const getAuthors = makeRequest(graphql, `
    {
      allStrapiAnnouncaterogies {
        edges {
          node {
            id
          }
        }
      }
    }
    `).then(result => {
    // Create pages for each user.
    result.data.allStrapiAnnouncaterogies.edges.forEach(({ node }) => {
      createPage({
        path: `/announcements/${node.id}`,
        component: path.resolve(`src/templates/announcement_details.js`),
        context: {
          id: node.id,
        },
      })
    })
  });
  
  // Query for articles nodes to use in creating pages.
  return Promise.all([
    getArticles,
    getAuthors,
  ])
};


