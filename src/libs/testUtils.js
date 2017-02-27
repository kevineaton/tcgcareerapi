import axios from 'axios';

import ConfigClass from './config';

export function makeCall(method, endpoint, data) {
  const api = ConfigClass.getConfig().api;
  const url = `${api}/${endpoint}/`;
  const meth = method.toLowerCase();
  const config = {
    method: meth,
    url: url,
    timeout: 5000
  };
  
  if (meth === 'get') {
    config.params = data;
  } else {
    config.data = data;
  }

  return axios(config)
  .then((res) => {
    return Promise.resolve({
      code: 200,
      body: res.data
    });
  })
  .catch((err) => {
    var ret = {
      code: 500,
      body: err
    };

    if(err.response && err.response.status) {
      ret.code = err.response.status;
      ret.body = err.response.data;
    }
    return Promise.resolve(ret);
  });
}

