using System;
using Xunit;
using smiteapi_microservice.Controllers;
using smiteapi_microservice.Interfaces;
using smiteapi_microservice.Services;
using smiteapi_microservice.Contexts;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using smiteapi_microservice.Models.Internal;
using smiteapi_microservice.Smiteapi_DB;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using smiteapi_microservice.Models.External;

namespace service_tests
{

    public class smiteapiControllerTests
    {
        private readonly SNL_Smiteapi_DBContext _mockedDB;

        public smiteapiControllerTests()
        {
            var options = new DbContextOptionsBuilder<SNL_Smiteapi_DBContext>()
            .UseInMemoryDatabase(databaseName: "SNL_Smiteapi_DB")
            .Options;

            // Insert seed data into the database using one instance of the context
            var context = new SNL_Smiteapi_DBContext(options);

            context.TableQueues.Add(new TableQueue { QueueId = 1, GameId = 1233, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = false });
            context.TableQueues.Add(new TableQueue { QueueId = 2, GameId = 1234, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = false });
            context.TableQueues.Add(new TableQueue { QueueId = 3, GameId = 1235, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = false });
            context.TableQueues.Add(new TableQueue { QueueId = 4, GameId = 1236, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = false });
            context.TableQueues.Add(new TableQueue { QueueId = 5, GameId = 1237, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = true });
            context.TableQueues.Add(new TableQueue { QueueId = 6, GameId = 1238, QueueDate = DateTime.Parse("2009-06-15T13:45:09"), QueueState = true });
            context.SaveChanges();
            //use across tests
            _mockedDB = context;

        }

        [Fact]
        public async Task GetAllQueuedMatchesFromDbTestAsync()
        {
            //Arrange
            var mock = new Mock<ILogger<MatchService>>();
            ILogger<MatchService> logger = mock.Object;
            var controller = new QueuedMatchController(new MatchService(_mockedDB,null,logger));

            //Act
            var result = await controller.Get();

            //Assert
            var QueuedMatches = Assert.IsType<ActionResult<List<QueuedMatch>>>(result);
            //check if something got returned
            Assert.True(QueuedMatches.Value != null);
            //check if the first match has a gameid of 1233
            Assert.Equal(1233, QueuedMatches.Value[0].gameID);
            //check if the date is still the same format as in the database
            Assert.Equal(DateTime.Parse("2009-06-15T13:45:09"), QueuedMatches.Value[0].scheduleTime);
            //check if only the 4 queuestate false got returned. because we only want the queuestate false results
            Assert.Equal(4, QueuedMatches.Value.Count());
        }

        private static Mock<IHirezApiContext> CreateMockHirezApiContext()
        {
            var mockHirezApiContext = new Mock<IHirezApiContext>();


            List<ApiPlayerMatchStat> match = new List<ApiPlayerMatchStat>();
            //Add 5 winners
            for (int i = 0; i < 5; i++)
            {
                match.Add(new ApiPlayerMatchStat
                {
                    Account_Level = 1,
                    ActiveId1 = 1,
                    ActiveId2 = 2,
                    ActivePlayerId = 12345678,
                    Ban1 = "Godname1",
                    Ban2 = "Godname2",
                    Ban3 = "Godname3",
                    Ban4 = "Godname4",
                    Ban5 = "Godname5",
                    Ban6 = "Godname6",
                    Ban7 = "Godname7",
                    Ban8 = "Godname8",
                    Ban9 = "Godname9",
                    Ban10 = "Godname10",
                    Ban1Id = 1,
                    Ban2Id = 2,
                    Ban3Id = 3,
                    Ban4Id = 4,
                    Ban5Id = 5,
                    Ban6Id = 6,
                    Ban7Id = 7,
                    Ban8Id = 8,
                    Ban9Id = 9,
                    Ban10Id = 10,
                    Damage_Bot = 1000,
                    Damage_Done_In_Hand = 1000,
                    Damage_Done_Magical = 1000,
                    Damage_Done_Physical = 0,
                    Damage_Mitigated = 0,
                    Damage_Player = 1000,
                    Damage_Taken = 1000,
                    Damage_Taken_Magical = 1000,
                    Damage_Taken_Physical = 1000,
                    Entry_Datetime = DateTime.Parse("2009-06-15T13:45:09"),
                    Assists = 1,
                    Kills_Fire_Giant = 1,
                    Kills_Gold_Fury = 1,
                    Kills_First_Blood = 0,
                    Kills_Player = 1,
                    Deaths = 1,
                    ItemId1 = 1,
                    ItemId2 = 2,
                    ItemId3 = 3,
                    ItemId4 = 4,
                    ItemId5 = 5,
                    ItemId6 = 6,
                    Item_Active_1 = "Active1",
                    Item_Active_2 = "Active2",
                    Item_Purch_1 = "Item1",
                    Item_Purch_2 = "Item2",
                    Item_Purch_3 = "Item3",
                    Item_Purch_4 = "Item4",
                    Item_Purch_5 = "Item5",
                    Item_Purch_6 = "Item6",
                    Win_Status = "Winner",
                    Wards_Placed = 0,
                    Distance_Traveled = 1000,
                    First_Ban_Side = "Winner",
                    Final_Match_Level = 20,
                    Towers_Destroyed = 2,
                    Structure_Damage = 20,
                    Gold_Earned = 10,
                    Gold_Per_Minute = 10,
                    GodId = 1,
                    hz_gamer_tag = "test",
                    hz_player_name = null,
                    playerId = 123566,
                    Time_In_Match_Seconds = 12032,
                    Healing = 100,
                    match_queue_id = 427,
                    ret_msg = null,
                    TaskForce = 1,
                    Winning_TaskForce = 1,
                    Region = "EU",
                });
            }
            //Add 5 losers
            for (int i = 0; i < 5; i++)
            {
                match.Add(new ApiPlayerMatchStat
                {
                    Account_Level = 1,
                    ActiveId1 = 1,
                    ActiveId2 = 2,
                    ActivePlayerId = 12345678,
                    Ban1 = "Godname1",
                    Ban2 = "Godname2",
                    Ban3 = "Godname3",
                    Ban4 = "Godname4",
                    Ban5 = "Godname5",
                    Ban6 = "Godname6",
                    Ban7 = "Godname7",
                    Ban8 = "Godname8",
                    Ban9 = "Godname9",
                    Ban10 = "Godname10",
                    Ban1Id = 1,
                    Ban2Id = 2,
                    Ban3Id = 3,
                    Ban4Id = 4,
                    Ban5Id = 5,
                    Ban6Id = 6,
                    Ban7Id = 7,
                    Ban8Id = 8,
                    Ban9Id = 9,
                    Ban10Id = 10,
                    Damage_Bot = 1000,
                    Damage_Done_In_Hand = 1000,
                    Damage_Done_Magical = 1000,
                    Damage_Done_Physical = 0,
                    Damage_Mitigated = 0,
                    Damage_Player = 1000,
                    Damage_Taken = 1000,
                    Damage_Taken_Magical = 1000,
                    Damage_Taken_Physical = 1000,
                    Entry_Datetime = DateTime.Parse("2009-06-15T13:45:09"),
                    Assists = 1,
                    Kills_Fire_Giant = 1,
                    Kills_Gold_Fury = 1,
                    Kills_First_Blood = 0,
                    Kills_Player = 1,
                    Deaths = 1,
                    ItemId1 = 1,
                    ItemId2 = 2,
                    ItemId3 = 3,
                    ItemId4 = 4,
                    ItemId5 = 5,
                    ItemId6 = 6,
                    Item_Active_1 = "Active1",
                    Item_Active_2 = "Active2",
                    Item_Purch_1 = "Item1",
                    Item_Purch_2 = "Item2",
                    Item_Purch_3 = "Item3",
                    Item_Purch_4 = "Item4",
                    Item_Purch_5 = "Item5",
                    Item_Purch_6 = "Item6",
                    Win_Status = "Loser",
                    Wards_Placed = 0,
                    Distance_Traveled = 1000,
                    First_Ban_Side = "Winner",
                    Final_Match_Level = 20,
                    Towers_Destroyed = 2,
                    Structure_Damage = 20,
                    Gold_Earned = 10,
                    Gold_Per_Minute = 10,
                    GodId = 1,
                    hz_gamer_tag = "test",
                    hz_player_name = null,
                    playerId = 123566,
                    Time_In_Match_Seconds = 12032,
                    Healing = 100,
                    match_queue_id = 427,
                    ret_msg = null,
                    TaskForce = 2,
                    Winning_TaskForce = 1,
                    Region = "EU",
                });
            }

            mockHirezApiContext.Setup(r => r.GetMatchDetailsByMatchID(1234)).ReturnsAsync(match);

            mockHirezApiContext.Setup(r => r.GetPatchInfo()).ReturnsAsync(
                    new ApiPatchInfo
                    {
                        ret_msg = null,
                        version_string = "7.12"
                    }
                );

            mockHirezApiContext.Setup(r => r.GetAllGods()).ReturnsAsync(
                new List<ApiGod>
                {
                    //could return more data but irrelvant for the test
                    new ApiGod
                    {
                        Name = "Godname1",
                        Id = 1
                    },
                    new ApiGod
                    {
                        Name = "Godname2",
                        Id = 2
                    },
                    new ApiGod
                    {
                        Name = "Godname3",
                        Id = 3
                    }

                }
            );

            mockHirezApiContext.Setup(r => r.GetAllItems()).ReturnsAsync(
                new List<ApiItem>
                {
                    //could return more data but irrelvant for the test
                    new ApiItem
                    {
                        ItemId = 1,
                        DeviceName = "Item1"
                    },
                    new ApiItem
                    {
                        ItemId = 2,
                        DeviceName = "Item2"
                    },
                    new ApiItem
                    {
                        ItemId = 3,
                        DeviceName = "Item3"
                    }

                }
            );

            mockHirezApiContext.Setup(r => r.SearchPlayerByName("Testuser")).ReturnsAsync(
                new List<ApiPlayer>
                {
                    //could return more data but irrelvant for the test
                    new ApiPlayer
                    {
                        Name = "Testuser",
                        player_id = 1,
                        portal_id = ApiPlatformEnum.PS4,
                        ret_msg = null
                    },
                    new ApiPlayer
                    {
                        Name = "Testuser123",
                        player_id = 2,
                        portal_id = ApiPlatformEnum.PS4,
                        ret_msg = null
                    },
                    new ApiPlayer
                    {
                        Name = "TestuserXD",
                        player_id = 3,
                        portal_id = ApiPlatformEnum.Steam,
                        ret_msg = null
                    },
                    new ApiPlayer
                    {
                        Name = "xxTestUser",
                        player_id = 4,
                        portal_id = ApiPlatformEnum.HiRez,
                        ret_msg = null
                    },
                    new ApiPlayer
                    {
                        Name = "TestuserBox",
                        player_id = 5,
                        portal_id = ApiPlatformEnum.Xbox,
                        ret_msg = null
                    }
                }
            );


            return mockHirezApiContext;
        }
    }

}
