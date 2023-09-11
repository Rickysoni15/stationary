var Sys = require('../../Boot/Sys');
const moment = require('moment');

module.exports = {
    home: async function(req, res) {
        try {
          let totalUsers = await Sys.App.Services.UserServices.getUserCount({ role: 'user'});
          var data = {
              App           : req.session.details,
              error         : req.flash("error"),
              success       : req.flash("success"),
              classActive   : 'active',
              user          : req.session.details,
              totalUsers    : totalUsers
          };
          return res.render('backend/templates/dashboard', data);
        } catch (e) {
            console.log("Error", e);
        }
    },

    vendor_Home: async function(req, res) {
        try {
          let totalUsers = await Sys.App.Services.UserServices.getUserCount({ role: 'user'});
          let totalCustomers = await Sys.App.Services.CustomerServices.getUserCount({ role: 'user'});
          let totalOrder = await Sys.App.Services.PaymentServices.getUserCount({ status: 'success'});
          let totalActiveOrder = await Sys.App.Services.PaymentServices.getUserCount({ order_status: 'Processing'});
          let totalCompletedOrder = await Sys.App.Services.PaymentServices.getUserCount({ order_status: 'completed'});
          var data = {
              App           : req.session.details,
              error         : req.flash("error"),
              success       : req.flash("success"),
              dashboard   : 'active',
              user          : req.session.details,
            //   totalUsers    : totalUsers,
              totalCustomers: totalCustomers,
              totalOrder: totalOrder,
              totalActiveOrder: totalActiveOrder,
              totalCompletedOrder: totalCompletedOrder
          };
          return res.render('backend/templates/vendor_dashboard', data);
        } catch (e) {
            console.log("Error", e);
        }
    },


    convertBigNumber: function(number) {
        if (number >= 1000000) {
            let newValue = number;
            const suffixes = ["", "K", "M", "B", "T"];
            let suffixNum = 0;
            while (newValue >= 1000) {
                newValue /= 1000;
                suffixNum++;
            }

            newValue = newValue.toPrecision(3);

            newValue += suffixes[suffixNum];
            return newValue;
        }
        return number;


    },

    /* getMonthlyPlayedGameChart:async function(req, res){
         let endDate =  moment().add(1,'days').format("YYYY-MM-DD");  // total 31 days report
         let startDate = moment().subtract(30, 'days').format("YYYY-MM-DD");

         let dateDiff =( moment().diff(moment().subtract(31, 'days')) ); //  because range dont take last value

         console.log("start", startDate);
         console.log("end date", endDate);
         let query =[
                     {
                         $match: {
                             createdAt: {
                                 $gte: new Date(startDate),
                                 $lt: new Date(endDate)

                              }
                         }
                     },
                     {$addFields:{

                          createdAt: {$subtract: [
                              '$createdAt',
                              {$add: [
                                  {$multiply: [{$hour: '$createdAt'}, 3600000]},
                                  {$multiply: [{$minute: '$createdAt'}, 60000]},
                                  {$multiply: [{$second: '$createdAt'}, 1000]},
                                  {$millisecond: '$createdAt'}
                              ]}
                          ]},
                          dateRange:{$map:{
                             input:{ $range:[0, moment(dateDiff).unix(), 60*60*24] },
                             as: "asCuRange",
                             in:{$multiply:["$$asCuRange",  1000 ]}
                          }},

                     }},

                     {$addFields:{
                       dateRange:{$map:{
                         input:"$dateRange",
                         in:{$add:[new Date(startDate),  "$$this" ]}
                       }},
                     }},
                     {$unwind:"$dateRange"},
                     {$group:{
                       _id:{date:"$dateRange"},
                       count:{$sum:{$cond:[{$eq:["$dateRange","$createdAt"]},1,0]}}
                     }},
                     {$sort:{_id:1}},
                     {$project:{
                       _id:0,
                       createdAt:"$_id",
                       total:"$count",
                     }}

         ];

         let monthlyGamePlayed = await Sys.App.Services.GameService.aggregateQuery(query);
         //console.log("game played**********888", monthlyGamePlayed);
         let dailyGamePlayedArray = [];
         let dateArray = [];
         for(user of monthlyGamePlayed)
         {
             dailyGamePlayedArray.push(user.total);
             dateArray.push(moment(user.createdAt.date).format("DD-MM"));

         }
         //console.log("array", dailyGamePlayedArray,dateArray )
         return res.json({dailyGamePlayedArray: dailyGamePlayedArray, dateArray: dateArray});
     },*/

    getMonthlyPlayedGameChart: async function(req, res) {
        let endDate = moment().add(1, 'days').format("YYYY-MM-DD"); // total 31 days report
        let startDate = moment().subtract(30, 'days').format("YYYY-MM-DD");


        let dateDiff = (moment().diff(moment().subtract(31, 'days'))); //  because range dont take last value

        // console.log("start", startDate);
        // console.log("end date", endDate);
        let query = [{
                $match: {
                    createdAt: {
                        $gte: new Date(startDate),
                        $lt: new Date(endDate)

                    }
                }
            },
            /*{
                $addFields:{
                    createdAt: {
                        $subtract: [
                            '$createdAt',
                            {
                                $add: [
                                    {$multiply: [{$hour: '$createdAt'}, 3600000]},
                                    {$multiply: [{$minute: '$createdAt'}, 60000]},
                                    {$multiply: [{$second: '$createdAt'}, 1000]},
                                    {$millisecond: '$createdAt'}
                                ]
                            }
                        ]
                    },
                    dateRange:{$map:{
                        input:{ $range:[0, moment(dateDiff).unix(), 60*60*24] },
                        as: "asCuRange",
                        in:{$multiply:["$$asCuRange",  1000 ]}
                    }},
                }
            },
            {
                $addFields:{
                    dateRange:{
                        $map:{
                            input:"$dateRange",
                            in:{$add:[new Date(startDate),  "$$this" ]}
                        }
                    },
                }
            },
            {$unwind:"$dateRange"},*/
            {
                $group: {
                    _id: {
                        $add: [
                            { $dayOfYear: "$createdAt" },
                        ]
                    },
                    createdAt: { $first: "$createdAt" },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            /*{
                $project:{
                    _id:0,
                    createdAt:"$_id",
                    total:"$count",
                }
            }*/

        ];

        let monthlyGamePlayed = await Sys.App.Services.transactionServices.getCommissionaggregateQuery(query);


        let dailyGamePlayedArray = [];
        let dateArray = [];
        for (user of monthlyGamePlayed) {
            //console.log("game played**********888", user);
            dailyGamePlayedArray.push(user.count);
            dateArray.push(moment(user.createdAt).format("DD-MM"));

        }
        //console.log("array", dailyGamePlayedArray,dateArray )
        return res.json({ dailyGamePlayedArray: dailyGamePlayedArray, dateArray: dateArray });
    },


    getGameUsageChart: async function(req, res) {
        let getTotalPlayer = await Sys.App.Services.PlayerServices.getPlayerCount();
        var platformdataObj = {};
        if (getTotalPlayer != 0) {
            let platformQuery = [

                {
                    "$group": {
                        "_id": { "platform_os": "$platform_os" },
                        "count": { "$sum": 1 } //status as platform
                    }
                },
                {
                    "$project": {
                        "count": 1,

                        "percentage": {
                            "$multiply": [
                                { "$divide": [100, getTotalPlayer] }, "$count"
                            ]
                        }

                    }
                }
            ];

            let getPlatformdata = await Sys.App.Services.PlayerServices.aggregateQuery(platformQuery);
            // console.log("getPlatformdata :",getPlatformdata)
            platformdataObj.android = getPlatformdata.filter(platform => platform._id.platform_os == 'android');
            platformdataObj.ios = getPlatformdata.filter(platform => platform._id.platform_os == 'ios');
            platformdataObj.webCount = getPlatformdata.filter(platform => platform._id.platform_os == 'other' || platform._id.platform_os == null).reduce((partial_sum, a) => partial_sum.count + a.count);


            // platformdataObj.android=getPlatformdata.filter(platform => platform._id.platform == 'android');
            // platformdataObj.web=getPlatformdata.filter(platform => platform._id.platform == 'web');
            // platformdataObj.ios=getPlatformdata.filter(platform => platform._id.platform == null);
        }

        //  console.log("platform",platformdataObj)
        res.json(platformdataObj);
    }



}
