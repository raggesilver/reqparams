/*
 * lib.ts
 *
 * Copyright 2019 Paulo Queiroz <pvaqueiroz@gmail.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import express = require('express');

class ReqParam {
  source: any;
  // Reference so other functions can use it
  params: any;

  extractSource(req: express.Request): Object {
    return this.source = req['body'];
  }

  exec(params: any): Function {
    return async (req: express.Request, res: express.Response,
      next: express.NextFunction) => {

      this.params = params;
      this.extractSource(req);

      let either: any = {};

      // Iterate through param keys
      for (const key in params) {

        if (params[key].either) {
          if (!(params[key].either in either))
            either[params[key].either] = new Array();
          // Action is to just push the key to the either group, it will later
          // on be validated (all at once)
          either[params[key].either].push(key);
        }

        // Check if key is present
        if (!(key in this.source)) {
          // Handle key not present
          if (params[key].required === false)
            continue ;
          // `either` is a new option a parameter can take. Each param can be
          // part of a group of `either`. They will be validated individually if
          // present and will only fail if (validation for one is false or if
          // none of the params in the group are present). Example:
          //
          // An user can log in either via email or username. So params
          // specifies:
          // { username: { either: 1 }, email: { either: 1 } }
          //
          // Note the `either` key for both has the same value, that is what
          // keeps them in the same group.
          else if (params[key].either) {
            continue ;
          }
          else if (!params[key].either) {
            // Required param not present
            return res.status(400).json({
              error: params[key].msg || `Param ${key} missing`
            });
          }
        }

        // If no valid validate function for param, continue
        if (typeof params[key].validate !== 'function')
          continue ;

        // Run validation function
        let valid = await params[key].validate(this.source[key]);
        if (valid !== true) {
          let msg = (typeof valid === 'string') ?
            valid : (params[key].msg || `Invalid param ${key}`);
          return res.status(400).json({ error: msg });
        }
      }

      // If all validation went well, check either groups
      for (const key in either) {
        // There must be at least one param of either in this.source, and if
        // there is we already know it's valid
        let present = false;
        either[key].forEach((paramName: string) => {
          if (paramName in this.source)
            present = true;
        });
        // If no param is present
        if (!present) {
          return res.status(400).json({
            error: `At least one of ${either[key].join(', ')} must be present`
          });
        }
      }

      next();
    };
  }
};

class ReqQuery extends ReqParam {
  extractSource(req: express.Request): Object {
    return this.source = req['query'];
  }
}

export const reqparams = (params: Object): Function => {
  return new ReqParam().exec(params);
};

export const reqquery = (params: Object): Function => {
  return new ReqQuery().exec(params);
};

export const notEmpty = (val: any): Boolean => {
  switch (typeof val) {
    case 'string':
      return (!/^\s*$/.test(val));
    case 'object':
      if (val instanceof Array)
        return (val.length != 0);
    default:
      return false;
  }
};
