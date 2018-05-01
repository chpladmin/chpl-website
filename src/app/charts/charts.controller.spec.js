(function () {
    'use strict';

    describe('the Charts component controller', function () {

        var $controller, $log, $q, mock, networkService, scope, vm;
        mock = {
            sedParticipantStatisticsCounts: [
                {'id': 187,'sedCount': 7,'participantCount': 130,'creationDate': 1520357057186,'deleted': false,'lastModifiedDate': 1520357057186,'lastModifiedUser': -3},
                {'id': 188,'sedCount': 2,'participantCount': 67,'creationDate': 1520357057200,'deleted': false,'lastModifiedDate': 1520357057200,'lastModifiedUser': -3},
                {'id': 189,'sedCount': 2,'participantCount': 72,'creationDate': 1520357057202,'deleted': false,'lastModifiedDate': 1520357057202,'lastModifiedUser': -3},
                {'id': 190,'sedCount': 61,'participantCount': 10,'creationDate': 1520357057204,'deleted': false,'lastModifiedDate': 1520357057204,'lastModifiedUser': -3},
                {'id': 191,'sedCount': 11,'participantCount': 11,'creationDate': 1520357057205,'deleted': false,'lastModifiedDate': 1520357057205,'lastModifiedUser': -3},
                {'id': 192,'sedCount': 4,'participantCount': 12,'creationDate': 1520357057207,'deleted': false,'lastModifiedDate': 1520357057207,'lastModifiedUser': -3},
                {'id': 193,'sedCount': 2,'participantCount': 13,'creationDate': 1520357057209,'deleted': false,'lastModifiedDate': 1520357057209,'lastModifiedUser': -3},
                {'id': 194,'sedCount': 1,'participantCount': 14,'creationDate': 1520357057210,'deleted': false,'lastModifiedDate': 1520357057210,'lastModifiedUser': -3},
                {'id': 195,'sedCount': 3,'participantCount': 15,'creationDate': 1520357057212,'deleted': false,'lastModifiedDate': 1520357057212,'lastModifiedUser': -3},
                {'id': 196,'sedCount': 7,'participantCount': 16,'creationDate': 1520357057213,'deleted': false,'lastModifiedDate': 1520357057213,'lastModifiedUser': -3},
                {'id': 197,'sedCount': 1,'participantCount': 81,'creationDate': 1520357057215,'deleted': false,'lastModifiedDate': 1520357057215,'lastModifiedUser': -3},
                {'id': 198,'sedCount': 6,'participantCount': 83,'creationDate': 1520357057216,'deleted': false,'lastModifiedDate': 1520357057216,'lastModifiedUser': -3},
                {'id': 199,'sedCount': 9,'participantCount': 20,'creationDate': 1520357057218,'deleted': false,'lastModifiedDate': 1520357057218,'lastModifiedUser': -3},
                {'id': 200,'sedCount': 1,'participantCount': 21,'creationDate': 1520357057219,'deleted': false,'lastModifiedDate': 1520357057219,'lastModifiedUser': -3},
                {'id': 201,'sedCount': 3,'participantCount': 22,'creationDate': 1520357057221,'deleted': false,'lastModifiedDate': 1520357057221,'lastModifiedUser': -3},
                {'id': 202,'sedCount': 3,'participantCount': 23,'creationDate': 1520357057222,'deleted': false,'lastModifiedDate': 1520357057222,'lastModifiedUser': -3},
                {'id': 203,'sedCount': 4,'participantCount': 24,'creationDate': 1520357057224,'deleted': false,'lastModifiedDate': 1520357057224,'lastModifiedUser': -3},
                {'id': 204,'sedCount': 3,'participantCount': 25,'creationDate': 1520357057226,'deleted': false,'lastModifiedDate': 1520357057226,'lastModifiedUser': -3},
                {'id': 205,'sedCount': 1,'participantCount': 26,'creationDate': 1520357057227,'deleted': false,'lastModifiedDate': 1520357057227,'lastModifiedUser': -3},
                {'id': 206,'sedCount': 1,'participantCount': 93,'creationDate': 1520357057228,'deleted': false,'lastModifiedDate': 1520357057228,'lastModifiedUser': -3},
                {'id': 207,'sedCount': 2,'participantCount': 159,'creationDate': 1520357057229,'deleted': false,'lastModifiedDate': 1520357057229,'lastModifiedUser': -3},
                {'id': 208,'sedCount': 2,'participantCount': 31,'creationDate': 1520357057230,'deleted': false,'lastModifiedDate': 1520357057230,'lastModifiedUser': -3},
                {'id': 209,'sedCount': 2,'participantCount': 32,'creationDate': 1520357057231,'deleted': false,'lastModifiedDate': 1520357057231,'lastModifiedUser': -3},
                {'id': 210,'sedCount': 2,'participantCount': 34,'creationDate': 1520357057233,'deleted': false,'lastModifiedDate': 1520357057233,'lastModifiedUser': -3},
                {'id': 211,'sedCount': 4,'participantCount': 35,'creationDate': 1520357057234,'deleted': false,'lastModifiedDate': 1520357057234,'lastModifiedUser': -3},
                {'id': 212,'sedCount': 2,'participantCount': 104,'creationDate': 1520357057235,'deleted': false,'lastModifiedDate': 1520357057235,'lastModifiedUser': -3},
                {'id': 213,'sedCount': 1,'participantCount': 172,'creationDate': 1520357057236,'deleted': false,'lastModifiedDate': 1520357057236,'lastModifiedUser': -3},
                {'id': 214,'sedCount': 1,'participantCount': 44,'creationDate': 1520357057237,'deleted': false,'lastModifiedDate': 1520357057237,'lastModifiedUser': -3},
                {'id': 215,'sedCount': 2,'participantCount': 113,'creationDate': 1520357057239,'deleted': false,'lastModifiedDate': 1520357057239,'lastModifiedUser': -3},
                {'id': 216,'sedCount': 2,'participantCount': 51,'creationDate': 1520357057240,'deleted': false,'lastModifiedDate': 1520357057240,'lastModifiedUser': -3},
                {'id': 217,'sedCount': 3,'participantCount': 56,'creationDate': 1520357057241,'deleted': false,'lastModifiedDate': 1520357057241,'lastModifiedUser': -3},
                {'id': 218,'sedCount': 1,'participantCount': 121,'creationDate': 1520357057243,'deleted': false,'lastModifiedDate': 1520357057243,'lastModifiedUser': -3},
                {'id': 219,'sedCount': 1,'participantCount': 124,'creationDate': 1520357057244,'deleted': false,'lastModifiedDate': 1520357057244,'lastModifiedUser': -3},
                {'id': 220,'sedCount': 1,'participantCount': 255,'creationDate': 1520357057246,'deleted': false,'lastModifiedDate': 1520357057246,'lastModifiedUser': -3},
            ],
        };

        var ageMockData = {
            'participantAgeStatistics': [
                {'id': 190,'ageCount': 3,'testParticipantAgeId': 2,'ageRange': '10-19','creationDate': 1521480652992,'deleted': false,'lastModifiedDate': 1521480652992,'lastModifiedUser': -3},
                {'id': 191,'ageCount': 740,'testParticipantAgeId': 3,'ageRange': '20-29','creationDate': 1521480652996,'deleted': false,'lastModifiedDate': 1521480652996,'lastModifiedUser': -3},
                {'id': 192,'ageCount': 1801,'testParticipantAgeId': 4,'ageRange': '30-39','creationDate': 1521480652997,'deleted': false,'lastModifiedDate': 1521480652997,'lastModifiedUser': -3},
                {'id': 193,'ageCount': 1406,'testParticipantAgeId': 5,'ageRange': '40-49','creationDate': 1521480652999,'deleted': false,'lastModifiedDate': 1521480652999,'lastModifiedUser': -3},
                {'id': 194,'ageCount': 1065,'testParticipantAgeId': 6,'ageRange': '50-59','creationDate': 1521480653000,'deleted': false,'lastModifiedDate': 1521480653000,'lastModifiedUser': -3},
                {'id': 195,'ageCount': 416,'testParticipantAgeId': 7,'ageRange': '60-69','creationDate': 1521480653002,'deleted': false,'lastModifiedDate': 1521480653002,'lastModifiedUser': -3},
                {'id': 196,'ageCount': 10,'testParticipantAgeId': 8,'ageRange': '70-79','creationDate': 1521480653003,'deleted': false,'lastModifiedDate': 1521480653003,'lastModifiedUser': -3},
            ],
        };

        var genderMockData = {
            'id': 31,
            'maleCount': 1748,
            'femaleCount': 3693,
            'creationDate': 1521480652800,
            'deleted': false,
            'lastModifiedDate': 1521480652800,
            'lastModifiedUser': -3,
        };

        var educationMockData = {
            'participantEducationStatistics': [
                {'id': 185,'educationCount': 7,'educationTypeId': 1,'education': 'No high school degree','creationDate': 1521480653169,'deleted': false,'lastModifiedDate': 1521480653169,'lastModifiedUser': -3},
                {'id': 186,'educationCount': 225,'educationTypeId': 2,'education': 'High school graduate, diploma or the equivalent (for example: GED)','creationDate': 1521480653174,'deleted': false,'lastModifiedDate': 1521480653174,'lastModifiedUser': -3},
                {'id': 187,'educationCount': 257,'educationTypeId': 3,'education': 'Some college credit, no degree','creationDate': 1521480653175,'deleted': false,'lastModifiedDate': 1521480653175,'lastModifiedUser': -3},
                {'id': 188,'educationCount': 277,'educationTypeId': 4,'education': 'Trade/technical/vocational training','creationDate': 1521480653178,'deleted': false,'lastModifiedDate': 1521480653178,'lastModifiedUser': -3},
                {'id': 189,'educationCount': 556,'educationTypeId': 5,'education': 'Associate degree','creationDate': 1521480653179,'deleted': false,'lastModifiedDate': 1521480653179,'lastModifiedUser': -3},
                {'id': 190,'educationCount': 1600,'educationTypeId': 6,'education': 'Bachelor\'s degree','creationDate': 1521480653181,'deleted': false,'lastModifiedDate': 1521480653181,'lastModifiedUser': -3},
                {'id': 191,'educationCount': 556,'educationTypeId': 7,'education': 'Master\'s degree','creationDate': 1521480653183,'deleted': false,'lastModifiedDate': 1521480653183,'lastModifiedUser': -3},
                {'id': 192,'educationCount': 1963,'educationTypeId': 9,'education': 'Doctorate degree (e.g., MD, DNP, DMD, PhD)','creationDate': 1521480653185,'deleted': false,'lastModifiedDate': 1521480653185,'lastModifiedUser': -3},
            ],
        };

        var professionalExpMockData = {
            'participantExperienceStatistics': [
                {'id': 1286,'participantCount': 120,'experienceMonths': -1,'creationDate': 1521480655200,'deleted': false,'lastModifiedDate': 1521480655200,'lastModifiedUser': -3},
                {'id': 1287,'participantCount': 16,'experienceMonths': 0,'creationDate': 1521480655204,'deleted': false,'lastModifiedDate': 1521480655204,'lastModifiedUser': -3},
                {'id': 1288,'participantCount': 4,'experienceMonths': 1,'creationDate': 1521480655210,'deleted': false,'lastModifiedDate': 1521480655210,'lastModifiedUser': -3},
                {'id': 1289,'participantCount': 18,'experienceMonths': 2,'creationDate': 1521480655214,'deleted': false,'lastModifiedDate': 1521480655214,'lastModifiedUser': -3},
                {'id': 1290,'participantCount': 17,'experienceMonths': 3,'creationDate': 1521480655215,'deleted': false,'lastModifiedDate': 1521480655215,'lastModifiedUser': -3},
                {'id': 1291,'participantCount': 2,'experienceMonths': 516,'creationDate': 1521480655217,'deleted': false,'lastModifiedDate': 1521480655217,'lastModifiedUser': -3},
                {'id': 1292,'participantCount': 6,'experienceMonths': 4,'creationDate': 1521480655219,'deleted': false,'lastModifiedDate': 1521480655219,'lastModifiedUser': -3},
                {'id': 1293,'participantCount': 1,'experienceMonths': 260,'creationDate': 1521480655221,'deleted': false,'lastModifiedDate': 1521480655221,'lastModifiedUser': -3},
                {'id': 1294,'participantCount': 1,'experienceMonths': 5,'creationDate': 1521480655223,'deleted': false,'lastModifiedDate': 1521480655223,'lastModifiedUser': -3},
                {'id': 1295,'participantCount': 27,'experienceMonths': 6,'creationDate': 1521480655227,'deleted': false,'lastModifiedDate': 1521480655227,'lastModifiedUser': -3},
                {'id': 1296,'participantCount': 3,'experienceMonths': 7,'creationDate': 1521480655230,'deleted': false,'lastModifiedDate': 1521480655230,'lastModifiedUser': -3},
                {'id': 1297,'participantCount': 94,'experienceMonths': 264,'creationDate': 1521480655232,'deleted': false,'lastModifiedDate': 1521480655232,'lastModifiedUser': -3},
                {'id': 1298,'participantCount': 12,'experienceMonths': 8,'creationDate': 1521480655234,'deleted': false,'lastModifiedDate': 1521480655234,'lastModifiedUser': -3},
                {'id': 1299,'participantCount': 2,'experienceMonths': 9,'creationDate': 1521480655235,'deleted': false,'lastModifiedDate': 1521480655235,'lastModifiedUser': -3},
                {'id': 1300,'participantCount': 1,'experienceMonths': 265,'creationDate': 1521480655237,'deleted': false,'lastModifiedDate': 1521480655237,'lastModifiedUser': -3},
                {'id': 1301,'participantCount': 9,'experienceMonths': 10,'creationDate': 1521480655239,'deleted': false,'lastModifiedDate': 1521480655239,'lastModifiedUser': -3},
                {'id': 1302,'participantCount': 19,'experienceMonths': 11,'creationDate': 1521480655241,'deleted': false,'lastModifiedDate': 1521480655241,'lastModifiedUser': -3},
                {'id': 1303,'participantCount': 117,'experienceMonths': 12,'creationDate': 1521480655243,'deleted': false,'lastModifiedDate': 1521480655243,'lastModifiedUser': -3},
                {'id': 1304,'participantCount': 3,'experienceMonths': 13,'creationDate': 1521480655244,'deleted': false,'lastModifiedDate': 1521480655244,'lastModifiedUser': -3},
                {'id': 1305,'participantCount': 6,'experienceMonths': 14,'creationDate': 1521480655246,'deleted': false,'lastModifiedDate': 1521480655246,'lastModifiedUser': -3},
                {'id': 1306,'participantCount': 8,'experienceMonths': 15,'creationDate': 1521480655247,'deleted': false,'lastModifiedDate': 1521480655247,'lastModifiedUser': -3},
                {'id': 1307,'participantCount': 2,'experienceMonths': 528,'creationDate': 1521480655249,'deleted': false,'lastModifiedDate': 1521480655249,'lastModifiedUser': -3},
                {'id': 1308,'participantCount': 2,'experienceMonths': 16,'creationDate': 1521480655250,'deleted': false,'lastModifiedDate': 1521480655250,'lastModifiedUser': -3},
                {'id': 1309,'participantCount': 24,'experienceMonths': 18,'creationDate': 1521480655251,'deleted': false,'lastModifiedDate': 1521480655251,'lastModifiedUser': -3},
                {'id': 1310,'participantCount': 1,'experienceMonths': 19,'creationDate': 1521480655253,'deleted': false,'lastModifiedDate': 1521480655253,'lastModifiedUser': -3},
                {'id': 1311,'participantCount': 63,'experienceMonths': 276,'creationDate': 1521480655254,'deleted': false,'lastModifiedDate': 1521480655254,'lastModifiedUser': -3},
                {'id': 1312,'participantCount': 10,'experienceMonths': 20,'creationDate': 1521480655257,'deleted': false,'lastModifiedDate': 1521480655257,'lastModifiedUser': -3},
                {'id': 1313,'participantCount': 3,'experienceMonths': 21,'creationDate': 1521480655259,'deleted': false,'lastModifiedDate': 1521480655259,'lastModifiedUser': -3},
                {'id': 1314,'participantCount': 202,'experienceMonths': 24,'creationDate': 1521480655261,'deleted': false,'lastModifiedDate': 1521480655261,'lastModifiedUser': -3},
                {'id': 1315,'participantCount': 5,'experienceMonths': 25,'creationDate': 1521480655263,'deleted': false,'lastModifiedDate': 1521480655263,'lastModifiedUser': -3},
                {'id': 1316,'participantCount': 1,'experienceMonths': 26,'creationDate': 1521480655264,'deleted': false,'lastModifiedDate': 1521480655264,'lastModifiedUser': -3},
                {'id': 1317,'participantCount': 2,'experienceMonths': 27,'creationDate': 1521480655266,'deleted': false,'lastModifiedDate': 1521480655266,'lastModifiedUser': -3},
                {'id': 1318,'participantCount': 2,'experienceMonths': 540,'creationDate': 1521480655268,'deleted': false,'lastModifiedDate': 1521480655268,'lastModifiedUser': -3},
                {'id': 1319,'participantCount': 2,'experienceMonths': 28,'creationDate': 1521480655269,'deleted': false,'lastModifiedDate': 1521480655269,'lastModifiedUser': -3},
                {'id': 1320,'participantCount': 47,'experienceMonths': 30,'creationDate': 1521480655271,'deleted': false,'lastModifiedDate': 1521480655271,'lastModifiedUser': -3},
                {'id': 1321,'participantCount': 28,'experienceMonths': 288,'creationDate': 1521480655273,'deleted': false,'lastModifiedDate': 1521480655273,'lastModifiedUser': -3},
                {'id': 1322,'participantCount': 1,'experienceMonths': 32,'creationDate': 1521480655275,'deleted': false,'lastModifiedDate': 1521480655275,'lastModifiedUser': -3},
                {'id': 1323,'participantCount': 1,'experienceMonths': 33,'creationDate': 1521480655278,'deleted': false,'lastModifiedDate': 1521480655278,'lastModifiedUser': -3},
                {'id': 1324,'participantCount': 1,'experienceMonths': 35,'creationDate': 1521480655280,'deleted': false,'lastModifiedDate': 1521480655280,'lastModifiedUser': -3},
                {'id': 1325,'participantCount': 350,'experienceMonths': 36,'creationDate': 1521480655282,'deleted': false,'lastModifiedDate': 1521480655282,'lastModifiedUser': -3},
                {'id': 1326,'participantCount': 1,'experienceMonths': 37,'creationDate': 1521480655284,'deleted': false,'lastModifiedDate': 1521480655284,'lastModifiedUser': -3},
                {'id': 1327,'participantCount': 4,'experienceMonths': 38,'creationDate': 1521480655286,'deleted': false,'lastModifiedDate': 1521480655286,'lastModifiedUser': -3},
                {'id': 1328,'participantCount': 1,'experienceMonths': 39,'creationDate': 1521480655288,'deleted': false,'lastModifiedDate': 1521480655288,'lastModifiedUser': -3},
                {'id': 1329,'participantCount': 4,'experienceMonths': 41,'creationDate': 1521480655290,'deleted': false,'lastModifiedDate': 1521480655290,'lastModifiedUser': -3},
                {'id': 1330,'participantCount': 14,'experienceMonths': 42,'creationDate': 1521480655293,'deleted': false,'lastModifiedDate': 1521480655293,'lastModifiedUser': -3},
                {'id': 1331,'participantCount': 171,'experienceMonths': 300,'creationDate': 1521480655295,'deleted': false,'lastModifiedDate': 1521480655295,'lastModifiedUser': -3},
                {'id': 1332,'participantCount': 1,'experienceMonths': 45,'creationDate': 1521480655297,'deleted': false,'lastModifiedDate': 1521480655297,'lastModifiedUser': -3},
                {'id': 1333,'participantCount': 1,'experienceMonths': 47,'creationDate': 1521480655299,'deleted': false,'lastModifiedDate': 1521480655299,'lastModifiedUser': -3},
                {'id': 1334,'participantCount': 245,'experienceMonths': 48,'creationDate': 1521480655301,'deleted': false,'lastModifiedDate': 1521480655301,'lastModifiedUser': -3},
                {'id': 1335,'participantCount': 3,'experienceMonths': 50,'creationDate': 1521480655303,'deleted': false,'lastModifiedDate': 1521480655303,'lastModifiedUser': -3},
                {'id': 1336,'participantCount': 2,'experienceMonths': 51,'creationDate': 1521480655305,'deleted': false,'lastModifiedDate': 1521480655305,'lastModifiedUser': -3},
            ],
        };

        var computerExpMockData = {
            'participantExperienceStatistics': [
                {'id': 1069,'participantCount': 1,'experienceMonths': 0,'creationDate': 1521480653727,'deleted': false,'lastModifiedDate': 1521480653727,'lastModifiedUser': -3},
                {'id': 1070,'participantCount': 2,'experienceMonths': 1,'creationDate': 1521480653732,'deleted': false,'lastModifiedDate': 1521480653732,'lastModifiedUser': -3},
                {'id': 1071,'participantCount': 1,'experienceMonths': 2,'creationDate': 1521480653734,'deleted': false,'lastModifiedDate': 1521480653734,'lastModifiedUser': -3},
                {'id': 1072,'participantCount': 2,'experienceMonths': 3,'creationDate': 1521480653736,'deleted': false,'lastModifiedDate': 1521480653736,'lastModifiedUser': -3},
                {'id': 1073,'participantCount': 2,'experienceMonths': 516,'creationDate': 1521480653738,'deleted': false,'lastModifiedDate': 1521480653738,'lastModifiedUser': -3},
                {'id': 1074,'participantCount': 9,'experienceMonths': 260,'creationDate': 1521480653740,'deleted': false,'lastModifiedDate': 1521480653740,'lastModifiedUser': -3},
                {'id': 1075,'participantCount': 8,'experienceMonths': 6,'creationDate': 1521480653742,'deleted': false,'lastModifiedDate': 1521480653742,'lastModifiedUser': -3},
                {'id': 1076,'participantCount': 1,'experienceMonths': 7,'creationDate': 1521480653745,'deleted': false,'lastModifiedDate': 1521480653745,'lastModifiedUser': -3},
                {'id': 1077,'participantCount': 74,'experienceMonths': 264,'creationDate': 1521480653747,'deleted': false,'lastModifiedDate': 1521480653747,'lastModifiedUser': -3},
                {'id': 1078,'participantCount': 4,'experienceMonths': 9,'creationDate': 1521480653749,'deleted': false,'lastModifiedDate': 1521480653749,'lastModifiedUser': -3},
                {'id': 1079,'participantCount': 2,'experienceMonths': 265,'creationDate': 1521480653750,'deleted': false,'lastModifiedDate': 1521480653750,'lastModifiedUser': -3},
                {'id': 1080,'participantCount': 4,'experienceMonths': 10,'creationDate': 1521480653752,'deleted': false,'lastModifiedDate': 1521480653752,'lastModifiedUser': -3},
                {'id': 1081,'participantCount': 6,'experienceMonths': 11,'creationDate': 1521480653754,'deleted': false,'lastModifiedDate': 1521480653754,'lastModifiedUser': -3},
                {'id': 1082,'participantCount': 21,'experienceMonths': 12,'creationDate': 1521480653755,'deleted': false,'lastModifiedDate': 1521480653755,'lastModifiedUser': -3},
                {'id': 1083,'participantCount': 3,'experienceMonths': 15,'creationDate': 1521480653758,'deleted': false,'lastModifiedDate': 1521480653758,'lastModifiedUser': -3},
                {'id': 1084,'participantCount': 1,'experienceMonths': 16,'creationDate': 1521480653760,'deleted': false,'lastModifiedDate': 1521480653760,'lastModifiedUser': -3},
                {'id': 1085,'participantCount': 6,'experienceMonths': 18,'creationDate': 1521480653762,'deleted': false,'lastModifiedDate': 1521480653762,'lastModifiedUser': -3},
                {'id': 1086,'participantCount': 1,'experienceMonths': 275,'creationDate': 1521480653764,'deleted': false,'lastModifiedDate': 1521480653764,'lastModifiedUser': -3},
                {'id': 1087,'participantCount': 47,'experienceMonths': 276,'creationDate': 1521480653766,'deleted': false,'lastModifiedDate': 1521480653766,'lastModifiedUser': -3},
                {'id': 1088,'participantCount': 10,'experienceMonths': 20,'creationDate': 1521480653768,'deleted': false,'lastModifiedDate': 1521480653768,'lastModifiedUser': -3},
                {'id': 1089,'participantCount': 3,'experienceMonths': 280,'creationDate': 1521480653770,'deleted': false,'lastModifiedDate': 1521480653770,'lastModifiedUser': -3},
                {'id': 1090,'participantCount': 31,'experienceMonths': 24,'creationDate': 1521480653772,'deleted': false,'lastModifiedDate': 1521480653772,'lastModifiedUser': -3},
                {'id': 1091,'participantCount': 5,'experienceMonths': 25,'creationDate': 1521480653774,'deleted': false,'lastModifiedDate': 1521480653774,'lastModifiedUser': -3},
                {'id': 1092,'participantCount': 2,'experienceMonths': 540,'creationDate': 1521480653776,'deleted': false,'lastModifiedDate': 1521480653776,'lastModifiedUser': -3},
                {'id': 1093,'participantCount': 16,'experienceMonths': 30,'creationDate': 1521480653777,'deleted': false,'lastModifiedDate': 1521480653777,'lastModifiedUser': -3},
                {'id': 1094,'participantCount': 47,'experienceMonths': 288,'creationDate': 1521480653779,'deleted': false,'lastModifiedDate': 1521480653779,'lastModifiedUser': -3},
                {'id': 1095,'participantCount': 1,'experienceMonths': 290,'creationDate': 1521480653781,'deleted': false,'lastModifiedDate': 1521480653781,'lastModifiedUser': -3},
                {'id': 1096,'participantCount': 74,'experienceMonths': 36,'creationDate': 1521480653783,'deleted': false,'lastModifiedDate': 1521480653783,'lastModifiedUser': -3},
                {'id': 1097,'participantCount': 1,'experienceMonths': 37,'creationDate': 1521480653785,'deleted': false,'lastModifiedDate': 1521480653785,'lastModifiedUser': -3},
                {'id': 1098,'participantCount': 1,'experienceMonths': 294,'creationDate': 1521480653787,'deleted': false,'lastModifiedDate': 1521480653787,'lastModifiedUser': -3},
                {'id': 1099,'participantCount': 2,'experienceMonths': 552,'creationDate': 1521480653790,'deleted': false,'lastModifiedDate': 1521480653790,'lastModifiedUser': -3},
                {'id': 1100,'participantCount': 6,'experienceMonths': 42,'creationDate': 1521480653792,'deleted': false,'lastModifiedDate': 1521480653792,'lastModifiedUser': -3},
                {'id': 1101,'participantCount': 591,'experienceMonths': 300,'creationDate': 1521480653794,'deleted': false,'lastModifiedDate': 1521480653794,'lastModifiedUser': -3},
                {'id': 1102,'participantCount': 2,'experienceMonths': 44,'creationDate': 1521480653797,'deleted': false,'lastModifiedDate': 1521480653797,'lastModifiedUser': -3},
                {'id': 1103,'participantCount': 4,'experienceMonths': 45,'creationDate': 1521480653798,'deleted': false,'lastModifiedDate': 1521480653798,'lastModifiedUser': -3},
                {'id': 1104,'participantCount': 63,'experienceMonths': 48,'creationDate': 1521480653800,'deleted': false,'lastModifiedDate': 1521480653800,'lastModifiedUser': -3},
                {'id': 1105,'participantCount': 2,'experienceMonths': 50,'creationDate': 1521480653802,'deleted': false,'lastModifiedDate': 1521480653802,'lastModifiedUser': -3},
                {'id': 1106,'participantCount': 2,'experienceMonths': 307,'creationDate': 1521480653804,'deleted': false,'lastModifiedDate': 1521480653804,'lastModifiedUser': -3},
                {'id': 1107,'participantCount': 1,'experienceMonths': 309,'creationDate': 1521480653805,'deleted': false,'lastModifiedDate': 1521480653805,'lastModifiedUser': -3},
                {'id': 1108,'participantCount': 1,'experienceMonths': 54,'creationDate': 1521480653808,'deleted': false,'lastModifiedDate': 1521480653808,'lastModifiedUser': -3},
                {'id': 1109,'participantCount': 57,'experienceMonths': 312,'creationDate': 1521480653809,'deleted': false,'lastModifiedDate': 1521480653809,'lastModifiedUser': -3},
                {'id': 1110,'participantCount': 88,'experienceMonths': 60,'creationDate': 1521480653811,'deleted': false,'lastModifiedDate': 1521480653811,'lastModifiedUser': -3},
                {'id': 1111,'participantCount': 64,'experienceMonths': 324,'creationDate': 1521480653813,'deleted': false,'lastModifiedDate': 1521480653813,'lastModifiedUser': -3},
                {'id': 1112,'participantCount': 2,'experienceMonths': 325,'creationDate': 1521480653815,'deleted': false,'lastModifiedDate': 1521480653815,'lastModifiedUser': -3},
                {'id': 1113,'participantCount': 1,'experienceMonths': 70,'creationDate': 1521480653816,'deleted': false,'lastModifiedDate': 1521480653816,'lastModifiedUser': -3},
                {'id': 1114,'participantCount': 177,'experienceMonths': 72,'creationDate': 1521480653818,'deleted': false,'lastModifiedDate': 1521480653818,'lastModifiedUser': -3},
                {'id': 1115,'participantCount': 14,'experienceMonths': 330,'creationDate': 1521480653819,'deleted': false,'lastModifiedDate': 1521480653819,'lastModifiedUser': -3},
                {'id': 1116,'participantCount': 1,'experienceMonths': 74,'creationDate': 1521480653821,'deleted': false,'lastModifiedDate': 1521480653821,'lastModifiedUser': -3},
                {'id': 1117,'participantCount': 1,'experienceMonths': 588,'creationDate': 1521480653823,'deleted': false,'lastModifiedDate': 1521480653823,'lastModifiedUser': -3},
                {'id': 1118,'participantCount': 6,'experienceMonths': 78,'creationDate': 1521480653825,'deleted': false,'lastModifiedDate': 1521480653825,'lastModifiedUser': -3},
                {'id': 1183,'participantCount': 3,'experienceMonths': 225,'creationDate': 1521480653944,'deleted': false,'lastModifiedDate': 1521480653944,'lastModifiedUser': -3},
            ],
        };

        var productExpMockData = {
            'participantExperienceStatistics': [
                {'id': 1196,'participantCount': 314,'experienceMonths': 0,'creationDate': 1521480654452,'deleted': false,'lastModifiedDate': 1521480654452,'lastModifiedUser': -3},
                {'id': 1197,'participantCount': 67,'experienceMonths': 1,'creationDate': 1521480654454,'deleted': false,'lastModifiedDate': 1521480654454,'lastModifiedUser': -3},
                {'id': 1198,'participantCount': 26,'experienceMonths': 2,'creationDate': 1521480654456,'deleted': false,'lastModifiedDate': 1521480654456,'lastModifiedUser': -3},
                {'id': 1199,'participantCount': 53,'experienceMonths': 3,'creationDate': 1521480654458,'deleted': false,'lastModifiedDate': 1521480654458,'lastModifiedUser': -3},
                {'id': 1200,'participantCount': 100,'experienceMonths': 132,'creationDate': 1521480654459,'deleted': false,'lastModifiedDate': 1521480654459,'lastModifiedUser': -3},
                {'id': 1201,'participantCount': 30,'experienceMonths': 4,'creationDate': 1521480654461,'deleted': false,'lastModifiedDate': 1521480654461,'lastModifiedUser': -3},
                {'id': 1202,'participantCount': 28,'experienceMonths': 5,'creationDate': 1521480654462,'deleted': false,'lastModifiedDate': 1521480654462,'lastModifiedUser': -3},
                {'id': 1203,'participantCount': 78,'experienceMonths': 6,'creationDate': 1521480654464,'deleted': false,'lastModifiedDate': 1521480654464,'lastModifiedUser': -3},
                {'id': 1204,'participantCount': 7,'experienceMonths': 7,'creationDate': 1521480654465,'deleted': false,'lastModifiedDate': 1521480654465,'lastModifiedUser': -3},
                {'id': 1205,'participantCount': 19,'experienceMonths': 8,'creationDate': 1521480654466,'deleted': false,'lastModifiedDate': 1521480654466,'lastModifiedUser': -3},
                {'id': 1206,'participantCount': 1,'experienceMonths': 264,'creationDate': 1521480654468,'deleted': false,'lastModifiedDate': 1521480654468,'lastModifiedUser': -3},
                {'id': 1207,'participantCount': 39,'experienceMonths': 9,'creationDate': 1521480654469,'deleted': false,'lastModifiedDate': 1521480654469,'lastModifiedUser': -3},
                {'id': 1208,'participantCount': 1,'experienceMonths': 265,'creationDate': 1521480654471,'deleted': false,'lastModifiedDate': 1521480654471,'lastModifiedUser': -3},
                {'id': 1209,'participantCount': 15,'experienceMonths': 10,'creationDate': 1521480654472,'deleted': false,'lastModifiedDate': 1521480654472,'lastModifiedUser': -3},
                {'id': 1210,'participantCount': 10,'experienceMonths': 11,'creationDate': 1521480654474,'deleted': false,'lastModifiedDate': 1521480654474,'lastModifiedUser': -3},
                {'id': 1211,'participantCount': 275,'experienceMonths': 12,'creationDate': 1521480654476,'deleted': false,'lastModifiedDate': 1521480654476,'lastModifiedUser': -3},
                {'id': 1212,'participantCount': 4,'experienceMonths': 13,'creationDate': 1521480654478,'deleted': false,'lastModifiedDate': 1521480654478,'lastModifiedUser': -3},
                {'id': 1213,'participantCount': 4,'experienceMonths': 14,'creationDate': 1521480654480,'deleted': false,'lastModifiedDate': 1521480654480,'lastModifiedUser': -3},
                {'id': 1214,'participantCount': 3,'experienceMonths': 15,'creationDate': 1521480654481,'deleted': false,'lastModifiedDate': 1521480654481,'lastModifiedUser': -3},
                {'id': 1215,'participantCount': 73,'experienceMonths': 144,'creationDate': 1521480654483,'deleted': false,'lastModifiedDate': 1521480654483,'lastModifiedUser': -3},
                {'id': 1216,'participantCount': 3,'experienceMonths': 16,'creationDate': 1521480654484,'deleted': false,'lastModifiedDate': 1521480654484,'lastModifiedUser': -3},
                {'id': 1217,'participantCount': 102,'experienceMonths': 18,'creationDate': 1521480654486,'deleted': false,'lastModifiedDate': 1521480654486,'lastModifiedUser': -3},
                {'id': 1218,'participantCount': 6,'experienceMonths': 20,'creationDate': 1521480654487,'deleted': false,'lastModifiedDate': 1521480654487,'lastModifiedUser': -3},
                {'id': 1219,'participantCount': 6,'experienceMonths': 276,'creationDate': 1521480654488,'deleted': false,'lastModifiedDate': 1521480654488,'lastModifiedUser': -3},
                {'id': 1220,'participantCount': 3,'experienceMonths': 21,'creationDate': 1521480654490,'deleted': false,'lastModifiedDate': 1521480654490,'lastModifiedUser': -3},
                {'id': 1221,'participantCount': 1,'experienceMonths': 150,'creationDate': 1521480654493,'deleted': false,'lastModifiedDate': 1521480654493,'lastModifiedUser': -3},
                {'id': 1222,'participantCount': 387,'experienceMonths': 24,'creationDate': 1521480654495,'deleted': false,'lastModifiedDate': 1521480654495,'lastModifiedUser': -3},
                {'id': 1223,'participantCount': 5,'experienceMonths': 26,'creationDate': 1521480654497,'deleted': false,'lastModifiedDate': 1521480654497,'lastModifiedUser': -3},
                {'id': 1224,'participantCount': 2,'experienceMonths': 27,'creationDate': 1521480654498,'deleted': false,'lastModifiedDate': 1521480654498,'lastModifiedUser': -3},
                {'id': 1225,'participantCount': 34,'experienceMonths': 156,'creationDate': 1521480654500,'deleted': false,'lastModifiedDate': 1521480654500,'lastModifiedUser': -3},
                {'id': 1226,'participantCount': 2,'experienceMonths': 28,'creationDate': 1521480654502,'deleted': false,'lastModifiedDate': 1521480654502,'lastModifiedUser': -3},
                {'id': 1227,'participantCount': 101,'experienceMonths': 30,'creationDate': 1521480654504,'deleted': false,'lastModifiedDate': 1521480654504,'lastModifiedUser': -3},
                {'id': 1228,'participantCount': 2,'experienceMonths': 286,'creationDate': 1521480654506,'deleted': false,'lastModifiedDate': 1521480654506,'lastModifiedUser': -3},
                {'id': 1229,'participantCount': 1,'experienceMonths': 31,'creationDate': 1521480654508,'deleted': false,'lastModifiedDate': 1521480654508,'lastModifiedUser': -3},
                {'id': 1230,'participantCount': 8,'experienceMonths': 32,'creationDate': 1521480654510,'deleted': false,'lastModifiedDate': 1521480654510,'lastModifiedUser': -3},
                {'id': 1231,'participantCount': 1,'experienceMonths': 288,'creationDate': 1521480654512,'deleted': false,'lastModifiedDate': 1521480654512,'lastModifiedUser': -3},
                {'id': 1232,'participantCount': 570,'experienceMonths': 36,'creationDate': 1521480654513,'deleted': false,'lastModifiedDate': 1521480654513,'lastModifiedUser': -3},
                {'id': 1233,'participantCount': 1,'experienceMonths': 37,'creationDate': 1521480654515,'deleted': false,'lastModifiedDate': 1521480654515,'lastModifiedUser': -3},
                {'id': 1234,'participantCount': 4,'experienceMonths': 38,'creationDate': 1521480654517,'deleted': false,'lastModifiedDate': 1521480654517,'lastModifiedUser': -3},
                {'id': 1235,'participantCount': 30,'experienceMonths': 168,'creationDate': 1521480654519,'deleted': false,'lastModifiedDate': 1521480654519,'lastModifiedUser': -3},
                {'id': 1236,'participantCount': 5,'experienceMonths': 40,'creationDate': 1521480654521,'deleted': false,'lastModifiedDate': 1521480654521,'lastModifiedUser': -3},
                {'id': 1237,'participantCount': 6,'experienceMonths': 41,'creationDate': 1521480654525,'deleted': false,'lastModifiedDate': 1521480654525,'lastModifiedUser': -3},
                {'id': 1238,'participantCount': 92,'experienceMonths': 42,'creationDate': 1521480654526,'deleted': false,'lastModifiedDate': 1521480654526,'lastModifiedUser': -3},
                {'id': 1239,'participantCount': 3,'experienceMonths': 43,'creationDate': 1521480654528,'deleted': false,'lastModifiedDate': 1521480654528,'lastModifiedUser': -3},
                {'id': 1240,'participantCount': 2,'experienceMonths': 44,'creationDate': 1521480654529,'deleted': false,'lastModifiedDate': 1521480654529,'lastModifiedUser': -3},
                {'id': 1241,'participantCount': 8,'experienceMonths': 300,'creationDate': 1521480654531,'deleted': false,'lastModifiedDate': 1521480654531,'lastModifiedUser': -3},
                {'id': 1242,'participantCount': 3,'experienceMonths': 45,'creationDate': 1521480654532,'deleted': false,'lastModifiedDate': 1521480654532,'lastModifiedUser': -3},
                {'id': 1243,'participantCount': 1,'experienceMonths': 46,'creationDate': 1521480654534,'deleted': false,'lastModifiedDate': 1521480654534,'lastModifiedUser': -3},
                {'id': 1244,'participantCount': 505,'experienceMonths': 48,'creationDate': 1521480654535,'deleted': false,'lastModifiedDate': 1521480654535,'lastModifiedUser': -3},
                {'id': 1245,'participantCount': 1,'experienceMonths': 49,'creationDate': 1521480654537,'deleted': false,'lastModifiedDate': 1521480654537,'lastModifiedUser': -3},
                {'id': 1246,'participantCount': 1,'experienceMonths': 51,'creationDate': 1521480654538,'deleted': false,'lastModifiedDate': 1521480654538,'lastModifiedUser': -3},
            ],
        };

        beforeEach(function () {
            module('chpl.charts', function ($provide) {
                $provide.decorator('networkService', function ($delegate) {
                    $delegate.getStatisticTypes = jasmine.createSpy('getSedParticipantStatisticsCount');
                    //$delegate.getStatistics = jasmine.createSpy('getStatistics');
                    return $delegate;
                });
            });

            inject(function (_$controller_, _$log_, _$q_, $rootScope, _networkService_) {
                $controller = _$controller_;
                $log = _$log_;
                $q = _$q_;
                networkService = _networkService_;

                spyOn(networkService, 'getSedParticipantStatisticsCount').and.returnValue($q.when(mock));
                spyOn(networkService, 'getParticipantGenderStatistics').and.returnValue($q.when(genderMockData));
                spyOn(networkService, 'getParticipantAgeStatistics').and.returnValue($q.when(ageMockData));
                spyOn(networkService, 'getParticipantEducationStatistics').and.returnValue($q.when(educationMockData));
                spyOn(networkService, 'getParticipantProfessionalExperienceStatistics').and.returnValue($q.when(professionalExpMockData));
                spyOn(networkService, 'getParticipantComputerExperienceStatistics').and.returnValue($q.when(computerExpMockData));
                spyOn(networkService, 'getParticipantProductExperienceStatistics').and.returnValue($q.when(productExpMockData));

                scope = $rootScope.$new();
                vm = $controller('ChartsController', {
                    $scope: scope,
                })
                scope.$digest();
            });
        });

        afterEach(function () {
            if ($log.debug.logs.length > 0) {
                /* eslint-disable no-console,angular/log */
                console.log('Debug:\n' + angular.toJson($log.debug.logs));
                /* eslint-enable no-console,angular/log */
            }
        });

        it('should exist', function () {
            expect(vm).toBeDefined();
        });

        /*
        describe('during load', function () {
            it('should get all of the statistics', function () {
                expect(networkService.getStatistics).toHaveBeenCalled();
                expect(vm.statistics.length).toBe(mock.types.length);
            });

            it('should build the columns', function () {
                expect(vm.chart.data.cols.length).toBe(5);
                expect(vm.chart.data.cols[0]).toEqual({label: 'Date', type: 'date' });
                expect(vm.chart.data.cols[1]).toEqual({label: mock.types[0].dataType, type: 'number'});
            });

            it('should build the rows', function () {
                expect(vm.chart.data.rows.length).toBe(71);
                expect(vm.chart.data.rows[0]).toEqual({c: [{v: new Date('Fri Apr 08 2016')},{v: 2302},{v: 2302},{v: 2302},{v: 2302}]});
            });
        });

        describe('when filtering on dates', function () {
            it('should know what the min & max dates are', function () {
                expect(vm.minDate).toEqual(new Date('Fri Apr 08 2016'));
                expect(vm.maxDate).toEqual(new Date('Fri Aug 11 2017'));
            });

            it('should reduce the data set when a start date is chosen', function () {
                var initLength = vm.chart.data.rows.length;
                vm.startDate = new Date('Sat Aug 13 2016');
                vm.applyFilter();
                expect(vm.chart.data.rows.length).toBeLessThan(initLength);
            });

            it('should reduce the data set when an end date is chosen', function () {
                var initLength = vm.chart.data.rows.length;
                vm.endDate = new Date('Sat Aug 13 2016');
                vm.applyFilter();
                expect(vm.chart.data.rows.length).toBeLessThan(initLength);
            });
        });
        */
    });
})();
