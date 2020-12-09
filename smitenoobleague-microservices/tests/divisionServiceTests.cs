using System;
using Xunit;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using Moq;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
//using service
using division_microservice.Classes;
using division_microservice.Controllers;
using division_microservice.Division_DB;
using division_microservice.Interfaces;
using division_microservice.Models.External;
using division_microservice.Models.Internal;
using division_microservice.Services;

namespace service_tests
{

    public class divisionServiceTests
    {
        private readonly SNL_Division_DBContext _mockedDB;

        public divisionServiceTests()
        {
            var options = new DbContextOptionsBuilder<SNL_Division_DBContext>()
            .UseInMemoryDatabase(databaseName: "SNL_Division_DB")
            .Options;

            // Insert seed data into the database using one instance of the context
            var context = new SNL_Division_DBContext(options);

            context.Database.EnsureDeleted();
            context.TableDivisions.Add(new TableDivision { DivisionName = "Test division 1" });
            context.TableDivisions.Add(new TableDivision { DivisionName = "Test division 2" });
            context.TableDivisions.Add(new TableDivision { DivisionName = "Test division 3" });
            context.TableDivisions.Add(new TableDivision { DivisionName = "Test division 4" });
            context.SaveChanges();
            //use across tests
            _mockedDB = context;

        }

        #region Division Controller
        [Fact]
        public async Task GetAllDivisionsFromDbWithTeams_TestAsync()
        {
            //Test a call that get's all the divisions from the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);
            

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.GetWithTeams();

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<Division>>>(result).Result as ObjectResult;
            var responseVal = response.Value as IEnumerable<Division>;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if the 4 divisions from the DB got returned
            Assert.Equal(4, responseVal.Count());
            //Check if the first entry is correct
            Assert.Equal("Test division 1", responseVal.First().DivisionName);
            //check if there are teams in the result
            Assert.True(responseVal.First().DivisionTeams.Count() > 0);
        }

        [Fact]
        public async Task GetAllDivisionsFromDb_TestAsync()
        {
            //Test a call that get's all the divisions from the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Get();

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<Division>>>(result).Result as ObjectResult;
            var responseVal = response.Value as IEnumerable<Division>;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if the 4 divisions from the DB got returned
            Assert.Equal(4, responseVal.Count());
            //Check if the first entry is correct
            Assert.Equal("Test division 1", responseVal.First().DivisionName);
        }

        [Fact]
        public async Task GetDivision_TestAsync()
        {
            //Test a call that gets a division from the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Get(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Division>>(result).Result as ObjectResult;
            var responseVal = response.Value as Division;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if the first entry is correct
            Assert.Equal("Test division 1", responseVal.DivisionName);
            //check if there are teams in the response
            Assert.True(responseVal.DivisionTeams.Count() > 0);
        }

        [Fact]
        public async Task GetDivisionWithTeamsEmpty_TestAsync()
        {
            //Test a call that get's a division that has no teams from the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Get(4);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Division>>(result).Result as ObjectResult;
            var responseVal = response.Value as Division;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if the first entry is correct
            Assert.Equal("Test division 4", responseVal.DivisionName);
            Assert.True(responseVal.DivisionTeams.Count() == 0);
        }

        [Fact]
        public async Task CreateNewDivision_TestAsync()
        {
            //Test a call that adds a division to the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Post("New division");

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Division>>(result).Result as ObjectResult;
            var responseVal = response.Value as Division;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if status code is created
            Assert.Equal(201, response.StatusCode);
            //Check if the entry is correct
            Assert.Equal("New division", responseVal.DivisionName);
            //check if the ID was auto generated
            Assert.True(responseVal.DivisionID > 0);
        }

        [Fact]
        public async Task CreateNewDivisionNameAlreadyTaken_TestAsync()
        {
            //Test a call that adds a division to the DB when the name is already taken

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Post("Test division 1");

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Division>>(result).Result as ObjectResult;
            var responseVal = response.Value;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if status code is created
            Assert.Equal(400, response.StatusCode);
            //Check if the response message is given
            Assert.Contains("Given division name is already in use", response.Value.ToString());
        }

        [Fact]
        public async Task UpdateDivision_TestAsync()
        {
            //Test a call that updates a division in the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Put(new Division {DivisionID = 1, DivisionName = "Test division 1 Edit" });

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Division>>(result).Result as ObjectResult;
            var responseVal = response.Value as Division;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if status code is created
            Assert.Equal(200, response.StatusCode);
            //Check if the response message is given
            Assert.Equal("Test division 1 Edit", responseVal.DivisionName);
        }

        [Fact]
        public async Task DeleteDivision_TestAsync()
        {
            //Test a call that deletes a division from the DB

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Delete(2);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<int>>(result).Result as ObjectResult;
            var responseVal = response.Value;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if status code is created
            Assert.Equal(200, response.StatusCode);
            //Check if the response message is given
            Assert.Equal("Division successfully deleted", responseVal.ToString());
        }

        [Fact]
        public async Task DeleteDivisionWithNonExistentId_TestAsync()
        {
            //Test a call that tries to delete a division from the DB with an invalid ID

            //Arrange
            var mock = new Mock<ILogger<DivisionService>>();
            ILogger<DivisionService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new DivisionController(new DivisionService(_mockedDB, logger, null, valService, externalServices.Object));

            //Act
            var result = await controller.Delete(10);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<int>>(result).Result as ObjectResult;
            var responseVal = response.Value;
            //check if something got returned
            Assert.True(responseVal != null);
            //check if status code is created
            Assert.Equal(404, response.StatusCode);
            //Check if the response message is given
            Assert.Equal("No division found with the given ID", responseVal.ToString());
        }
        #endregion

        #region Schedule Controller
        [Fact]
        public async Task CreateScheduleForDivision_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult>(result) as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(201, response.StatusCode);
            Assert.Contains("Schedule succesfully generated and saved", response.Value.ToString());
        }

        [Fact]
        public async Task CreateScheduleForNonExistendDivision_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.PostAsync(new ScheduleCreation { DivisionID = 14, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult>(result) as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(400, response.StatusCode);
            Assert.Contains("Can't create a schedule if the division doesn't exist", response.Value.ToString());
        }

        [Fact]
        public async Task CreateScheduleForDivisionWithOverlappingDate_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //test data
            await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Act
            var result = await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult>(result) as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(400, response.StatusCode);
            Assert.Contains("New schedule can't be overlapping with another schedule", response.Value.ToString());
        }

        [Fact]
        public async Task CreateScheduleForDivisionWithNoTeams_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.PostAsync(new ScheduleCreation { DivisionID = 4, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult>(result) as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(400, response.StatusCode);
            Assert.Contains("Can't create a schedule if the division has no teams", response.Value.ToString());
        }

        [Fact]
        public async Task GetAllSchedulesByDivisionId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //create test data
            await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Act
            var result = await controller.GetByDivisionID(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<Schedule>>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(200, response.StatusCode);
            //check if schedules are returned
            Assert.True((response.Value as IEnumerable<Schedule>).Count() > 0);
            //check if name is stored
            Assert.Equal("Split 1", (response.Value as IEnumerable<Schedule>).First().ScheduleName);
            //check if matchups are retrieved
            Assert.True((response.Value as IEnumerable<Schedule>).First().Matchups.Count() > 0);
        }

        [Fact]
        public async Task GetAllSchedulesByDivisionByIdNoSchedulesCreated_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.GetByDivisionID(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<Schedule>>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(404, response.StatusCode);
            //check response message
            Assert.Equal("No schedules found for the given divisionID", response.Value.ToString());
        }

        [Fact]
        public async Task GetAllSchedulesByDivisionWithInvalidId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act      
            var result = await controller.GetByDivisionID(50);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<Schedule>>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(404, response.StatusCode);
            //check response message
            Assert.Equal("No schedules found for the given divisionID", response.Value.ToString());
        }

        [Fact]
        public async Task GetAllScheduleIdsByDivisionId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //create test data
            await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Act
            var result = await controller.GetListOfScheduleIds(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<int>>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(200, response.StatusCode);
            //check response message
            Assert.True((response.Value as IEnumerable<int>).Count() > 0);
        }

        [Fact]
        public async Task GetAllScheduleIdsByDivisionWithInvalidId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act        
            var result = await controller.GetListOfScheduleIds(50);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<IEnumerable<int>>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(404, response.StatusCode);
            //check response message
            Assert.Equal("No schedules found for the given divisionID", response.Value.ToString());
        }

        [Fact]
        public async Task GetScheduleByScheduleId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));
            //create test data
            await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Act
            var result = await controller.GetByScheduleID(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Schedule>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(200, response.StatusCode);
            //check response valuess
            Assert.True((response.Value as Schedule).DivisionID == 1);
            Assert.Equal("Split 1", (response.Value as Schedule).ScheduleName);
        }

        [Fact]
        public async Task GetScheduleByScheduleWithInvalidId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.GetByScheduleID(50);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Schedule>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(404, response.StatusCode);
            //check response message
            Assert.Equal("No schedule found for the given scheduleID", response.Value.ToString());
        }

        [Fact]
        public async Task RemoveScheduleByScheduleId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));
            //create test data
            await controller.PostAsync(new ScheduleCreation { DivisionID = 1, ScheduleName = "Split 1", ScheduleStartDate = DateTime.Now });

            //Act
            var result = await controller.Delete(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Schedule>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(200, response.StatusCode);
            //check response message
            Assert.Equal("Sucessfully deleted the schedule", response.Value.ToString());
        }

        [Fact]
        public async Task RemoveScheduleByScheduleWithInvalidId_TestAsync()
        {
            //Test a call that creates a schedule for the given division

            //Arrange
            var mock = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> logger = mock.Object;

            var mock2 = new Mock<ILogger<ValidationService>>();
            ILogger<ValidationService> valLogger = mock2.Object;
            IValidationService valService = new ValidationService(_mockedDB, valLogger);

            Mock<IExternalServices> externalServices = CreateMockExternalServices();

            var mock3 = new Mock<ILogger<ScheduleService>>();
            ILogger<ScheduleService> schedLogger = mock3.Object;
            IScheduleService scheduleService = new ScheduleService(_mockedDB, schedLogger, valService, externalServices.Object);

            var controller = new ScheduleController(new ScheduleService(_mockedDB, logger, valService, externalServices.Object));

            //Act
            var result = await controller.Delete(1);

            //Assert
            var response = Assert.IsAssignableFrom<ActionResult<Schedule>>(result).Result as ObjectResult;
            //check if something got returned
            Assert.True(response != null);
            Assert.Equal(404, response.StatusCode);
            //check response message
            Assert.Equal("No schedule found for the given scheduleID", response.Value.ToString());
        }
        #endregion

        #region private methods
        private static Mock<IExternalServices> CreateMockExternalServices()
        {
            var mockExternalServices = new Mock<IExternalServices>();

            //Division teams
            mockExternalServices.Setup(r => r.GetDivisionTeamsByIdAsync(It.IsAny<int>())).ReturnsAsync(new List<Team> {
                new Team { TeamName = "team1", TeamID = 1 },
                new Team { TeamName = "team2", TeamID = 2 },
                new Team { TeamName = "team3", TeamID = 3 },
                new Team { TeamName = "team4", TeamID = 4 },
                new Team { TeamName = "team5", TeamID = 5 },
                new Team { TeamName = "team6", TeamID = 6 },
                new Team { TeamName = "team7", TeamID = 7},
                new Team { TeamName = "team8", TeamID = 8 }});

            mockExternalServices.Setup(r => r.GetDivisionTeamsByIdAsync(4)).ReturnsAsync(new List<Team>());


            return mockExternalServices;
        }
        #endregion
    }

}
