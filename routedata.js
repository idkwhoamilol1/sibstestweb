var routeData = {
    "data": [
        {
            "route": "41A",
            "enabled": true,
            "color": "#4a90e2",
            "bound": "A,B",
            "viaDirectionCn": "北灘, 北頓, 北環轉車站, 中環, 陽光站",
            "viaDirectionEn": "North Beach, Norton, Northern Inter., Central, Sunshine Station",
            "routeType": "Zone 4 daytime route",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "Original",
                    "color": "#4a90e2"
                }
            },
            "timetable": {
                "normal": {
                    "firstTime": "0500",
                    "lastTime": "0050",
                    "interval": [
                        {"time": "0500-0050", "interval": "5-15"}
                    ]
                }
            },
            "stops": {
                "A": [
                    {"seq": 1, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "匯豐總行", "nameEn": "HSBC Headquake", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "北頓碼頭", "nameEn": "Norton Ferry Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "綠寶石中心", "nameEn": "Emerald Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北環轉車站", "nameEn": "Northern Interchanged", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "匯豐總行", "nameEn": "HSBC Headquake", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "47",
            "enabled": true,
            "color": "#4a90e2",
            "bound": "A,B",
            "viaDirectionCn": "北頓, 北島花園, 陽光大學, 東錦葵, 南環, 陽光站, 中環",
            "viaDirectionEn": "Norton, North Island Estate, Sunshine University, Eastmallow, Southern, Sunshine Station, Central",
            "routeType": "Zone 4 daytime route",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "Original",
                    "color": "#4a90e2"
                }
            },
            "timetable": {
                "normal": {
                    "firstTime": "0500",
                    "lastTime": "0100",
                    "interval": [
                        {"time": "0500-0100", "interval": "8-30"}
                    ]
                }
            },
            "stops": {
                "A": [
                    {"seq": 1, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "粉虹商場", "nameEn": "Pink Mall", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "強生街市", "nameSubCn": "A05, 陽光大學南環校園", "nameEn": "Johnson Market", "nameSubEn": "A05, Sunshine University Southern Campus", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "政府總部", "nameEn": "Government Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "東錦葵邨 - 陽葵屋", "nameEn": "Eastmallow Estate - Sunny House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "陽光大學", "nameEn": "Sunshine University", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "月亮繞道", "nameEn": "Moon Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "中環橋", "nameEn": "Central Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "北島花園南樓", "nameEn": "NIE - South Tower", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "北頓碼頭", "nameEn": "Norton Ferry Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 20, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 21, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "綠寶石中心", "nameEn": "Emerald Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北島花園南樓", "nameEn": "NIE - South Tower", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "中環橋", "nameEn": "Central Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "月亮繞道", "nameEn": "Moon Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "陽光大學", "nameEn": "Sunshine University", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "東錦葵海傍路", "nameEn": "Eastmallow Praya Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "政府總部", "nameEn": "Government Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "中環消防局", "nameEn": "Central Fire Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 20, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "49A",
            "enabled": true,
            "color": "#4a90e2",
            "bound": "A,B",
            "viaDirectionCn": "北灘, 北頓, 北環轉車站, 中環, 陽光站",
            "viaDirectionEn": "North Beach, Norton, Northern Inter., Central, Sunshine Station",
            "routeType": "Zone 4 daytime route",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "Original",
                    "color": "#4a90e2"
                }
            },
            "timetable": {
                "normal": {
                    "firstTime": "0600",
                    "lastTime": "0050",
                    "interval": [
                        {"time": "0600-0050", "interval": "30"}
                    ]
                }
            },
            "stops": {
                "A": [
                    {"seq": 1, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "匯豐總行", "nameEn": "HSBC Headquake", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "落山邨", "nameEn": "Downhill Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "巨石路60號", "nameEn": "60 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "北島山頂", "nameEn": "North Island Hill Peak", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "巨石路35號", "nameEn": "35 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "巨石路20號", "nameEn": "20 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "巨石路20號", "nameEn": "20 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "巨石路35號", "nameEn": "35 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "北島山頂", "nameEn": "North Island Hill Peak", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "巨石路60號", "nameEn": "60 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "落山邨", "nameEn": "Downhill Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "匯豐總行", "nameEn": "HSBC Headquake", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]}
                ]
            }
        }
    ]
};
