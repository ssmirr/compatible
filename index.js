const http = require('http');

class Compatible {
    static async dependency(pkgName, pkgManager, calculateSuccessRate = false) {
        let updateData = await this.getUpdateData(pkgName, pkgManager);
        let result = updateData.updates.concat(updateData.single_version_updates);

        if (calculateSuccessRate) {
            result = result.map(update => {
                return {
                    ...update,
                    success_rate: this.getSuccessRate(update.candidate_updates, update.successful_updates)
                }
            });
        }

        return result;
    }

    static async version(pkgName, pkgManager, ToVersion) {
        let updateData = await this.getUpdateData(pkgName, pkgManager);
        let result = updateData.semver_updates.filter(update => update.updated_version === ToVersion)[0];
        // console.log('thisisresults: ', pkgName, pkgManager, ToVersion)
        if(result) result.success_rate = this.getSuccessRate(result.candidate_updates, result.successful_updates);
        return result;
    }

    static async update(pkgName, pkgManager, FromVersion, ToVersion) {
        let updateData = await this.dependency(pkgName, pkgManager);
        let result = updateData.filter(update => update.previous_version === FromVersion && update.updated_version === ToVersion)[0];
        if(result) result.success_rate = this.getSuccessRate(result.candidate_updates, result.successful_updates);
        return result;
    }

    static getSuccessRate(candidate_updates, successful_updates) {
        return +(successful_updates / candidate_updates).toFixed(2);
    }

    static async getUpdateData(pkgName, pkgManager) {
        return new Promise((resolve, reject) => {
            http.get(`http://api.dependabot.com/compatibility_scores?dependency-name=${pkgName}&package-manager=${pkgManager}&version-scheme=semver`, (res) => {
                const {
                    statusCode
                } = res;
                const contentType = res.headers['content-type'];

                let error;
                if (statusCode !== 200) {
                    error = new Error('Request Failed.\n' +
                        `Status Code: ${statusCode}`);
                } else if (!/^application\/json/.test(contentType)) {
                    error = new Error('Invalid content-type.\n' +
                        `Expected application/json but received ${contentType}`);
                }
                if (error) {
                    console.error(error.message);
                    // consume response data to free up memory
                    res.resume();
                    return;
                }

                res.setEncoding('utf8');
                let rawData = '';
                res.on('data', (chunk) => {
                    rawData += chunk;
                });
                res.on('end', () => {
                    try {
                        const parsedData = JSON.parse(rawData);
                        resolve(parsedData);
                    } catch (e) {
                        reject(e.message);
                    }
                });
            }).on('error', (e) => {
                console.error(`Got error: ${e.message}`);
            });
        });
    }
}

module.exports = Compatible;