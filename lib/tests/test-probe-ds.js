describe("Tonic Data Manager - Download JSON/Images using pattern", function() {
    it('test fetch for probe ds', function(done) { 
        var jsonDataModel = {},
            nbImageAvailable = 0,
            exepectedNbImages = 1,
            urlToBeValid = [],
            nbToFree = 0,
            alreadyFree = 0;

        expect(tonicDataManager).toBeDefined();

        tonicDataManager.on('/data/probe/info.json', function(data) {
            testHelper(null, data);
        });

        tonicDataManager.on('images', function(data) {
            testHelper(null, data);
        });

        tonicDataManager.on('error', function(error, data) {
            testHelper(error, data);
        });

        // Trigger the download request
        var fetchURL = '/data/probe/info.json',
            url = tonicDataManager.fetchURL(fetchURL, 'json');
        expect(url).toEqual(fetchURL);

        // Look response
        testHelper.waitAndRun(function(d) {
            // No error
            expect(d.error).toBeNull();
            expect(d.response).not.toBeNull();

            jsonDataModel = d.response.data;

            expect(jsonDataModel.dimensions).toEqual([500, 250, 30]);
            expect(jsonDataModel.spacing).toEqual([1.0, 1.0, 4.0]);
            expect(jsonDataModel.fields).toEqual([ "temperature" ]);
            expect(jsonDataModel.slices).toEqual([ "0", "1", "2" ]);
            expect(jsonDataModel.sprite_size).toEqual(10);

            // Register file pattern
            tonicDataManager.registerURL('images', '/data/probe/' + jsonDataModel.name_pattern, 'blob', 'image/png');
            var count = exepectedNbImages = jsonDataModel.slices.length;
            while(count--) {
                tonicDataManager.fetch('images', { 
                    time: jsonDataModel.arguments.time.values[0], 
                    field: jsonDataModel.fields[0], 
                    slice: jsonDataModel.slices[count] 
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
                expect(nbToFree).toBeGreaterThan(0);
                expect(alreadyFree).toBeGreaterThan(0);

                testHelper.done(done);
            } else if (nbImageAvailable < exepectedNbImages) {
                testHelper.waitAndRun(handleImage);
            }
        }

        testHelper.waitAndRun(handleImage);
    });
});
