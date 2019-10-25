
function checkParams(params, _source) {
  return async (req, res, next) => {
    // Actual source
    const source = req[_source];

    for (const k in params) {
      // If not present in body
      if (!(k in source)) {
        // If not optional
        if (!params[k].optional)
          return res.status(400).json({
            error: params[k].msg || `Param '${k}' missing.`
          });
        // If it is optional skip it
        else
          continue ;
      }

      // If type was specified
      if ('type' in params[k]) {
        if (typeof params[k].type !== 'function')
          throw new TypeError(
            'Key type must be of type Function (e.g. Number, Array, ...)'
          );

        if (Object.prototype.toString.call(source[k]) !==
            Object.prototype.toString.call(params[k].type())) {
          // Value has wrong type
          return res.status(400).json({
            error: params[k].msg || `Invalid type for param '${k}'.`
          });
        }
      }

      // If validate function was specified
      if (typeof params[k].validate === 'function') {
        let _valid = await params[k].validate(source[k]);
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
}

module.exports = {
  /**
   * @param {Object} params Object with required keys
   */
  reqparams(params) {
    return checkParams(params, 'body');
  },

  /**
   * @param {Object} params Object with required keys
   */
  reqquery(params) {
    return checkParams(params, 'query');
  },

  /**
   * Check if a string only contains whitespaces
   * @param {String|Array} val The string or array to be tested
   *
   * @returns {Boolean}
   */
  notEmpty(val) {
    if (val instanceof Array)
      return (val.length > 0);
    else
      return (!/^\s*$/.test(val));
  }

};
