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

            tonicDataManager.on(urlToFetch, function(data, envelope) {
                notificationCount++;
                console.log('notification n:' + notificationCount + '/f:' + fetchCount);
                testHelper(null, data);
            });

            function createNewFetch() {
                // Trigger the download request
                console.log('fetch ' + (1+fetchCount));
                var url = tonicDataManager.fetchURL(urlToFetch, 'blob', 'image/jpg');
                fetchCount++;
                expect(url).toEqual(urlToFetch);

                // Inspect data
                testHelper.waitAndRun(function(d) {
                    // No error
                    expect(d.error).toBeNull();
                    expect(d.response).not.toBeNull();

                    console.log('n: ' +notificationCount + ' f: ' + fetchCount + ' t: ' + numberToTry);

                    // Finish test
                    if(notificationCount === fetchCount && notificationCount === numberToTry) {
                        console.log('Fetch/Notification: done with success');
                        // tonicDataManager.destroy();
                        testHelper.done(done);
                    }

                    if(fetchCount < numberToTry) {
                        createNewFetch();
                    }
                });
            }

            createNewFetch();
        });
});
