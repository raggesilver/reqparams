
module.exports = {
  /**
   * @param {Object} params Object with required keys
   */
  reqparams(params) {
    return async (req, res, next) => {
      // Foreach key in params
      for (const k in params) {
        // If not present in body
        if (!(k in req.body)) {
          // If not optional
          if (!params[k].optional)
            return res.status(400).json({
              error: params[k].msg || `Param '${k}' missing.`
            });
          // If it is optional skip it
          else
            continue ;
        }

        // If validate function was specified
        if (typeof params[k].validate === 'function') {
          let _valid = await params[k].validate(req.body[k]);
          if (_valid !== true) {
            if (typeof _valid === 'string')
              return res.status(400).json({ error: _valid });
            return (
              res.status(400).json({
                error: params[k].msg || `Invalid param '${k}'.`
              }));
          }
        }
      }
      next();
    };
  },

  /**
   * @param {Object} params Object with required keys
   */
  reqquery(params) {
    return async (req, res, next) => {
      // Foreach key in params
      for (const k in params) {
        // If not present in query and not optional
        if (!(k in req.query)) {
          // If not optional
          if (!params[k].optional)
            return res.status(400).json({
              error: params[k].msg || `Param '${k}' missing.`
            });
          // If it is optional skip it
          else
            continue ;
        }

        // If validate function was specified
        if (typeof params[k].validate === 'function') {
          let _valid = await params[k].validate(req.query[k]);
          if (_valid !== true) {
            if (typeof _valid === 'string')
              return res.status(400).json({ error: _valid });
            return (
              res.status(400).json({
                error: params[k].msg || `Invalid param '${k}'.`
              }));
          }
        }
      }
      next();
    };
  },

  /**
   * Check if a string only contains whitespaces
   * @param {String} str The string to be tested
   *
   * @returns {Boolean}
   */
  notEmpty(str) {
    return (!/^\s*$/.test(str));
  }

};
