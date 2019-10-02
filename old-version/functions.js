var wait_finish = timeout => {
  return new Promise((r, j) => {
    var check = () => {
      // console.log(open_issues, closed_issues);
      if (open_issues && closed_issues) r();
      else if ((timeout -= 100) < 0) j('time out');
      else setTimeout(check, 100);
    }
    check();
  });
}

var waitResolved = (promises, timeout) =>
  new Promise((res, rej) => {
    var check = () => {
      // console.log(open_issues, closed_issues);
      let resolved = promises.reduce((r, $promise) => {
        console.log($promise);
        return r && $promise.isResolved;
      }, true);

      if (resolved) res();
      else if ((timeout -= 100) < 0) rej('time out');
      else setTimeout(check, 100);
    }
    check();
  });

let wait = verification =>
  new Promise(res => {
    let check = () => {
      if (verification()) res();
      else setTimeout(check, Math.random() * 50);
    }
    check();
  });

let cacheFileLock = false;
let cache = {};
let cacheLoaded = false;
let loadCache = reload => {
  if (reload) {
    cache = {};
    return;
  }
  if (cacheLoaded) {
    return;
  }
  if (localStorage.getItem('github_cache')) {
    try {
      cache = JSON.parse(
        LZString.decompress(
          localStorage.getItem('github_cache')
        )
      );
    } catch (e) {
      localStorage.removeItem('github_cache');
    }
  }
  cacheLoaded = true;
}

let cachedGithubAjax = (url, success, reload) => {
  reload = reload || false;

  loadCache(false);
  if (!reload && cache[url]) {
    console.log(`getting from cache: ${url}`);
    [data, status, linkHeader] = cache[url];
    return success(data, status, linkHeader);
  }

  return $.get({
    url: url,
    success: (data, status, headers) => {
      var linkHeader = headers.getResponseHeader('link') || false;
      success(data, status, linkHeader);

      wait(() => cacheFileLock == false).then(() => {
        cacheFileLock = true;

        loadCache(false);
        cache[url] = [data, status, linkHeader];
        // console.log(cache);
        var cacheData = JSON.stringify(cache);
        console.log('compressing data...');
        cacheData = LZString.compress(cacheData);
        // console.log('putting into cache: ' + cacheData);
        console.log(`putting into cache: ${url}`)
        localStorage.setItem('github_cache', cacheData);

        cacheFileLock = false;
      });

    }
  });
}

let proxiedGithubAjax = (url, watcher, success, reload) => {
  reload = reload || false;

  let r = reload ? '&r=1' : '';
  if (watcher && watcher.requests) watcher.requests.push(url);
  return $.get({
    url: `http://localhost:9999/proxy/?t=${Date.now()}${r}&url=${encodeURIComponent(url)}`,
    success: (data, status, headers) => {
      var linkHeader = headers.getResponseHeader('link') || false;
      if (watcher && watcher.completed) watcher.completed.push(url);
      success(data, status, linkHeader);
    }
  });
}

let getGithubData = (url, watcher, reload) =>
  new Promise(ok => {
    reload = reload || false;

    proxiedGithubAjax(url, watcher, (data, status, linkHeader) => {
      var _data = [];
      _data.push(data);

      var _links = linkHeader || false;
      if (_links == false) return ok(_data.flat());

      var links = _links
        .split(',')
        .reduce((obj, link) => {
          let match = link.match(/<(.*?page=(\d+).*)>; rel="(.*?)"/);
          // console.log(match);
          obj[match[3]] = [match[1], match[2]];
          return obj;
        }, {});

        var link_ptrn = links['next'][0];
        var first = parseInt(links['next'][1]);
        var last = parseInt(links['last'][1]);
        // console.log(first, last);

        var ajax_calls = [];
        for (i = first; i <= last; i++) {
          ajax_calls.push(
            proxiedGithubAjax(
              link_ptrn.replace(/page=(\d+)/, `page=${i}`),
              watcher,
              (data) => {
                _data.push(data);
              }
            )
          );
        }
        $.when.apply(null, ajax_calls).then(() => {
          // console.log('abacou...');
          ok(_data.flat());
        })

        // waitResolved(promises, 2000).then(ok());

    }, reload);
  });


let getTime = (timeString) => new Date(timeString).getTime();