const compatible = require('./index');

(async () => {
    console.log(await compatible.update('django', 'pip', '2.1.4', '2.1.5'))
    console.log(await compatible.version('got', 'npm_and_yarn', '9.5.0'))
    console.log(await compatible.dependency('got', 'npm_and_yarn', true))
})();
