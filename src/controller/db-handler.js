const namespaces = {
  config: 'CONFIG_',
  post: 'POST_',
  deleted: 'DELETED',
  updated: 'UPDATED_',
  fetch: 'FETCH',
  theme: 'THEME'
}

const THEME = function (dark) {
  return JSON.stringify({
    dark: dark
  })
}

export function instantiateDB (FETCH) {
  console.log('instantiating localstorage databases')

  if (localStorage.getItem(`${namespaces.config}${namespaces.fetch}`) === null) {
    console.log('FETCH Config...')
    localStorage.setItem(`${namespaces.config}${namespaces.fetch}`, JSON.stringify(FETCH || {}))
  }
  if (localStorage.getItem(`${namespaces.config}${namespaces.theme}`) === null) {
    console.log('THEME Config...')
    localStorage.setItem(`${namespaces.config}${namespaces.theme}`, JSON.stringify(THEME(false)))
  }

  console.log('done...')
}

export function getDeletedPosts (page, limit) {
  const deletedPosts = []
  for (const key of Object.keys(localStorage)) {
    if (key.slice(0, 5) === namespaces.post && localStorage[key] === namespaces.deleted && [...Array(limit).keys()].map(i => i + (page - 1) * limit).includes(parseInt(key.slice(5)) - 1)) {
      deletedPosts.push(parseInt(key.slice(5)))
    }
  }
  return deletedPosts
}

export function getTotalDeletedPosts () {
  const deletedPosts = []
  console.log('retrieving total deleted posts')

  for (const key of Object.keys(localStorage)) {
    if (key.slice(0, 5) === namespaces.post && localStorage[key] === namespaces.deleted) {
      console.log(`FOUND deleted Post ${key.slice(5)}`)

      deletedPosts.push(parseInt(key.slice(5)))
    }
  }

  console.log(`found ${deletedPosts.length} deleted posts.`)

  return deletedPosts
}

export function getTotalUpdatedPosts () {
  const updatedPosts = []
  console.log('retrieving total updated posts')

  for (const key of Object.keys(localStorage)) {
    if (key.slice(0, 5) === namespaces.post && localStorage[key].slice(0, namespaces.updated.length) === namespaces.updated) {
      console.log(`FOUND updated Post ${key.slice(5)}`)

      updatedPosts.push(parseInt(key.slice(5)))
    }
  }

  console.log(`found ${updatedPosts.length} updated posts.`)

  return updatedPosts
}

export function getUpdatedPost (id, Batch) {
  console.log(`retrieving updated posts:\n\t ${Batch || id}`)

  if (Batch) {
    const posts = {}
    Batch.forEach((pid) => {
      posts[pid] = JSON.parse(localStorage.getItem(`${namespaces.post}${pid}`).slice(namespaces.updated.length))
      console.log(posts)
    })
    return posts
  }
  console.log('returning...')

  try {
    return JSON.parse(localStorage.getItem(`${namespaces.post}${id}`).slice(namespaces.updated.length))
  } catch (e) {
    console.warn(e)
    return localStorage.getItem(`${namespaces.post}${id}`)
  }
}

export function setThemeConfig (dark) {
  localStorage.setItem(`${namespaces.config}${namespaces.theme}`, THEME(dark))
}

export function getThemeConfig (key, Keys) {
  if (Keys) {

  } else {
    return JSON.parse(localStorage.getItem(`${namespaces.config}${namespaces.theme}`))[key]
  }
}
