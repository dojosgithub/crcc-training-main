import { getActiveUsersWSummary, getAllClients } from '/both/api/methods/admin-all-users.js'

if(Meteor.isServer) {

SyncedCron.config({
  // Log job run details to console
  log: true,

  // Use a custom logger function (defaults to Meteor's logging package)
  logger: null,

  // Name of collection to use for synchronisation and logging
  collectionName: 'cron_log',

  // Default to using localTime
  utc: false,
  /*
    TTL in seconds for history records in collection to expire
    NOTE: Unset to remove expiry but ensure you remove the index from
    mongo by hand

    ALSO: SyncedCron can't use the `_ensureIndex` command to modify
    the TTL index. The best way to modify the default value of
    `collectionTTL` is to remove the index by hand (in the mongo shell
    run `db.cronHistory.dropIndex({startedAt: 1})`) and re-run your
    project. SyncedCron will recreate the index with the updated TTL.    
  */  
  collectionTTL: 516000
});

/* no longer needed as all data is now inside the main db (05/10/2021)
SyncedCron.add({
    name: "Sync_All_Users",
    schedule: function(parser) {
        return parser.cron("00 07 * * *") //-- 7am (UTC) (= 2am EST, 1am CST as daylight saving ended) every day
        // return parser.cron("44 23 * * *"); //-- for test purpose
    },
    job: function() {
        let result = getActiveUsersWSummary.call(true)
        // console.log(result)
        return result && result.data || null
    }
});

SyncedCron.start();
*/

}
