module.exports = {
  id: 'pancake_storybook',
  viewports: [
    {
      label: 'phone',
      width: 320,
      height: 480,
    },
    {
      label: 'tablet',
      width: 1024,
      height: 768,
    },
  ],
  scenarios: [scenario('atoms-button--primary'), scenario('atoms-button--secondary')],
  paths: {
    bitmaps_reference: 'reports/backstop_data/bitmaps_reference',
    bitmaps_test: 'reports/backstop_data/bitmaps_test',
    html_report: 'reports/backstop_data/html_report',
    ci_report: 'reports/backstop_data/ci_report',
  },
  report: ['browser'],
  engine: 'puppeteer',
  engineOptions: {
    args: ['--no-sandbox'],
  },
  asyncCaptureLimit: 5,
  asyncCompareLimit: 50,
  debug: false,
  debugWindow: false,
};

function scenario(storyId = '') {
  return {
    label: storyId,
    url: `http://host.docker.internal:6006/iframe.html?viewMode=story&id=${storyId}`,
  };
}
