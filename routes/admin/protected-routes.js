const HL = require('./../../models/hl')
const utils = require('./../../lib/functions')

function prepareHymns(req, res, next) {
  const page = req.params.page || 1;
  const slice = 20;  // how many items to show per page.
  const query = HL.find({}).select('number title').sort({number: 1});
  query.exec((err, docs) => {
    let response = [];
    if (docs) {
    }
    req.templateArgs = {
      breadcrums: [
        {title: 'HL', href: 'admin/hls'},
        {title: 'All'},
      ],
      hymns: utils.paginate(docs, page, slice, false, false),
    }
    next();
  });
}

module.exports = [
  {path: '/', template: 'admin/dashboard'},
  {path: '/dashboard', template: 'admin/dashboard'},
  {
    path: '/hls',
    template: 'admin/hls',
    prepare: prepareHymns,
  },
  {
    path: '/hls/:page',
    template: 'admin/hls',
    prepare: prepareHymns,
  },
];
