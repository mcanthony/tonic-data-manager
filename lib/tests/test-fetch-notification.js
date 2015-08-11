describe("Tonic Data Manager - Trigger n fetch and check the amount of notification", function() {
        it('test fetch/notification count match', function(done) {
            var tonicDataManager = null,
                urlToFetch = '/base/data/arctic/mpas-composite/rgb.jpg',
                numberToTry = 10,
                fetchCount = 0,
                notificationCount = 0;
            testHelper.start();

            expect(TonicDataManager).toBeDefined();
            tonicDataManager = new TonicDataManager();

            tonicDataManager.on('error', function(data, envelope) {
                console.error('ERROR');
                testHelper(data.error, data.response);
            });

            function createNewFetch() {
                tonicDataManager.on(urlToFetch, function(data, envelope) {
                    testHelper(null, data);
                });

                // Trigger the download request
                var url = tonicDataManager.fetchURL(urlToFetch, 'blob', 'image/jpg');
                fetchCount++;
                expect(url).toEqual(urlToFetch);

                // Inspect data
                testHelper.waitAndRun(function(d) {
                    // No error
                    expect(d.error).toBeNull();
                    expect(d.response).not.toBeNull();

                    notificationCount++;

                    // Finish test
                    if(notificationCount === fetchCount && notificationCount === numberToTry) {
                        console.log('Fetch/Notification: done with success');
                        // tonicDataManager.destroy();
                        testHelper.done(done);
                    }
                });
            }

            while(fetchCount < numberToTry) {
                createNewFetch();
            }
        });
});
