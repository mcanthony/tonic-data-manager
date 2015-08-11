describe("Tonic Data Manager - Download JSON/Images using pattern", function() {
    it('test fetch for probe ds', function(done) {
        var jsonDataModel = {},
            nbImageAvailable = 0,
            exepectedNbImages = 1,
            urlToBeValid = [],
            nbToFree = 0,
            alreadyFree = 0,
            tonicDataManager = null;

        testHelper.start();

        expect(TonicDataManager).toBeDefined();

        tonicDataManager = new TonicDataManager();

        tonicDataManager.on('/base/data/arctic/probe/info.json', function(data, envelope) {
            testHelper(null, data);
        });

        tonicDataManager.on('images', function(data, envelope) {
            testHelper(null, data);
        });

        tonicDataManager.on('error', function(data, envelope) {
            testHelper(data.error, data.data);
        });

        // Trigger the download request
        var fetchURL = '/base/data/arctic/probe/info.json',
            url = tonicDataManager.fetchURL(fetchURL, 'json');
        expect(url).toEqual(fetchURL);

        // Look response
        testHelper.waitAndRun(function(d) {
            // No error
            expect(d.error).toBeNull();
            expect(d.response).not.toBeNull();

            jsonDataModel = d.response.data;

            expect(jsonDataModel["InSituDataProber"].dimensions).toEqual([500, 250, 30]);
            expect(jsonDataModel["InSituDataProber"].spacing).toEqual([0.72, 0.672, 4 ]);
            expect(jsonDataModel.InSituDataProber.fields).toEqual([ "temperature", "salinity" ]);
            expect(jsonDataModel["InSituDataProber"].sprite_size).toEqual(10);

            // Register file pattern
            tonicDataManager.registerURL('images', '/base/data/arctic/probe/' + jsonDataModel.data[0].pattern, 'blob', 'image/png');
            var count = exepectedNbImages = 1;
            while(count--) {
                tonicDataManager.fetch('images', {
                    time: jsonDataModel.arguments.time.values[0],
                    field: 'temperature'
                });
            }
        });

        function handleImage(d) {
            nbImageAvailable++;

            // No error
            expect(d.error).toBeNull();
            expect(d.response).not.toBeNull();

            urlToBeValid.push(d.response.requestedURL);

            if(nbImageAvailable === exepectedNbImages) {
                var count = urlToBeValid.length;
                while(count--) {
                    expect(tonicDataManager.get(urlToBeValid[count])).not.toBeNull();
                    var freeResource = (count % 2 === 0);
                    expect(tonicDataManager.get(urlToBeValid[count], freeResource).data.size).toBeGreaterThan(10);
                }

                // Test that the cache is empty
                count = urlToBeValid.length;
                while(count--) {
                    if(tonicDataManager.get(urlToBeValid[count])) {
                        tonicDataManager.free(urlToBeValid[count]);
                        nbToFree++;
                    } else {
                        alreadyFree++;
                    }
                    expect(tonicDataManager.get(urlToBeValid[count])).toBeUndefined();

                    // Should not hurt to free it again
                    tonicDataManager.free(urlToBeValid[count]);
                }

                // We should have to free some
                // expect(nbToFree).toBeGreaterThan(0);
                // expect(alreadyFree).toBeGreaterThan(0);

                console.log('JSON/Images pattern: done with success');
                // tonicDataManager.destroy();
                testHelper.done(done);
            } else if (nbImageAvailable < exepectedNbImages) {
                testHelper.waitAndRun(handleImage);
            }
        }

        testHelper.waitAndRun(handleImage);
    });
});
