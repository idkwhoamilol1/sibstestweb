var routeData = {
    "data": [
        {
            "route": "41A",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "北頓, 北環轉車站, 中環 和 南環",
            "viaDirectionEn": "Norton, Northern Interchange, Central and Southern",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "05:40",
                        "lastTime": "00:30",
                        "interval": [
                            {"time": "05:40 - 00:30", "interval": "5 - 30"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "05:30",
                        "lastTime": "00:30",
                        "interval": [
                            {"time": "05:30 - 00:30", "interval": "5 - 30"}
                        ]
                    }
                }
            },
            "stops": {
                "B": [
                    {"seq": 1, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "北頓碼頭", "nameEn": "Norton Ferry Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]}
                ],
                "A": [
                    {"seq": 1, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "綠寶石中心", "nameEn": "Emerald Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
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
            "route": "42",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "陽光站, 中環醫院 和 北環轉車站",
            "viaDirectionEn": "Sunshine Station, Central Hospital and Northern Interchange",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "06:30",
                        "lastTime": "23:00",
                        "interval": [
                            {"time": "06:30 - 23:00", "interval": "10 - 30"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "06:00",
                        "lastTime": "23:00",
                        "interval": [
                            {"time": "06:00 - 23:00", "interval": "10 - 30"}
                        ]
                    }
                }
            },
            "stops": {
                "B": [
                    {"seq": 1, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "紅地磚", "nameEn": "Red Wall Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "北環中心", "nameEn": "Northern Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "班尼街", "nameEn": "Brown Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "雀鳥橋", "nameEn": "Bird Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "亞特路", "nameEn": "Arctan Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "中環消防局", "nameEn": "Central Fire Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "南環臺", "nameEn": "Southern Terrance", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "中環醫院", "nameEn": "Central Hospital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "南環運動場", "nameEn": "Southern Sports Field", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "M∞", "nameEn": "Museum Infinite", "visible": true, "stopFor": ["normal"]},
                    {"seq": 20, "nameCn": "南環文化區公園", "nameEn": "Southern Cultural District Park", "visible": true, "stopFor": ["normal"]},
                    {"seq": 21, "nameCn": "中葉隧道行政大樓", "nameEn": "Leafy-Central Tunnel Administration Block", "visible": true, "stopFor": ["normal"]},
                    {"seq": 22, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 23, "nameCn": "中環南總站", "nameEn": "Southern Central Bus Terminus", "visible": true, "stopFor": ["normal"]}
                ],
                "A": [
                    {"seq": 1, "nameCn": "中環南總站", "nameEn": "Southern Central Bus Terminus", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "中葉隧道行政大樓", "nameEn": "Leafy-Central Tunnel Administration Block", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "南環文化區公園", "nameEn": "Southern Cultural District Park", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "南環運動場", "nameEn": "Southern Sports Field", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "中環醫院", "nameEn": "Central Hospital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "南環臺", "nameEn": "Southern Terrance", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "中環消防局", "nameEn": "Central Fire Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "新紀元中心", "nameEn": "Ping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "雀鳥橋", "nameEn": "Bird Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "班尼街", "nameEn": "Brown Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "北環中心", "nameEn": "Northern Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "紅地磚", "nameEn": "Red Wall Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "北頓游泳池", "nameEn": "Norton Swimming Pool", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 20, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 21, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 22, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "42OLD",
            "enabled": true,
            "bound": "C",
            "viaDirectionCn": "北島花園, 北頓, 北環轉車站, 北環, 中環 和 陽光高鐵站",
            "viaDirectionEn": "North Island Estate, Norton, Northern Interchange, Northern, Central, Sunshine Station",
            "routeType": "已取消路綫 - 彩蛋",
            "routeTypeEn": "Cancelled route - Easter Egg",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "C": {
                    "normal": {
                        "firstTime": "-",
                        "lastTime": "-",
                        "interval": [
                            {"time": "24 hours", "interval": "6 - 15"}
                        ]
                    }
                }
            },
            "stops": {
                "C": [
                    {"seq": 1, "nameCn": "中環南總站", "nameEn": "Southern Central Bus Terminus", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "政府總部, 中葉隧道行政大樓", "nameEn": "Government Office, Leafy-Central Tunnel Administration Block", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "南環花園", "nameEn": "Southern One", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "南環花園二期", "nameEn": "Southern Two", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "陽光廣場, 陽光碼頭", "nameEn": "Sunshine Square, Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "陽光高鐵站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "中環醫院", "nameEn": "Central Hospital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "南環臺", "nameEn": "Southern Terrance", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "中環消防局", "nameEn": "Central Fire Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "粉虹商場, 新紀元中心", "nameEn": "Pink Mall, Ping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "雀鳥橋", "nameEn": "Bird Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "班尼街", "nameEn": "Brown Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "彩虹樓, 北環中心", "nameEn": "Colourful Building, Northern Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "紅地磚", "nameEn": "Red Wall Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "北頓游泳池", "nameEn": "Norton Swimming Pool", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 20, "nameCn": "^^北島花園商場", "nameEn": "^^NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 21, "nameCn": "北島花園巨石樓", "nameEn": "NIE - Rocky Tower", "visible": true, "stopFor": ["normal"]},
                    {"seq": 22, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 23, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 24, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 25, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 26, "nameCn": "紅地磚", "nameEn": "Red Wall Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 27, "nameCn": "彩虹樓, 北環中心", "nameEn": "Colourful Building, Northern Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 28, "nameCn": "班尼街", "nameEn": "Brown Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 29, "nameCn": "雀鳥橋", "nameEn": "Bird Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 30, "nameCn": "紫屋, 亞特路", "nameEn": "Purple House, Arctan Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 31, "nameCn": "南窗, 中環消防局", "nameEn": "South Glass, Central Fire Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 32, "nameCn": "強生花園, 強生街市", "nameEn": "Johnson Garden, Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 33, "nameCn": "南環臺", "nameEn": "Southern Terrance", "visible": true, "stopFor": ["normal"]},
                    {"seq": 34, "nameCn": "中環醫院", "nameEn": "Central Hospital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 35, "nameCn": "陽光高鐵站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 36, "nameCn": "陽光廣場, 陽光碼頭", "nameEn": "Sunshine Plaza, Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 37, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 38, "nameCn": "南環花園二期", "nameEn": "Southern Two", "visible": true, "stopFor": ["normal"]},
                    {"seq": 39, "nameCn": "中環南總站", "nameEn": "Southern Central Bus Terminus", "visible": true, "stopFor": ["normal"]},
                ]
            }
        },
        {
            "route": "42A",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "陽光站, 中環醫院 和 北環轉車站",
            "viaDirectionEn": "Sunshine Station, Central Hospital and Northern Interchange",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "05:30",
                        "lastTime": "01:10",
                        "interval": [
                            {"time": "05:30 - 01:10", "interval": "5-50"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "05:40 or 07:00",
                        "lastTime": "00:50",
                        "interval": [
                            {"time": "MON-FRI-> 05:40 - 01:30", "interval": "5-50"},
                            {"time": "SAT,SUN,HOLIDAY-> 07:00 - 01:30", "interval": "5-50"}
                        ]
                    }
                }
            },
            "stops": {
                "B": [
                    {"seq": 1, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "北頓游泳池", "nameEn": "Norton Swimming Pool", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]}
                ],
                "A": [
                    {"seq": 1, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "46",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "北環轉車站 和 東錦葵邨",
            "viaDirectionEn": "Northern Interchange and Eastmallow Estate",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "06:00",
                        "lastTime": "00:50",
                        "interval": [
                            {"time": "07:00 - 24:00", "interval": "15 - 60"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "06:00",
                        "lastTime": "00:50",
                        "interval": [
                            {"time": "06:30 - 23:30", "interval": "15 - 60"}
                        ]
                    }
                }
            },
            "stops": {
                "A": [
                    {"seq": 1, "nameCn": "明月角", "nameEn": "Lunar Point", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "中環橋", "nameEn": "Central Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "東錦葵邨 - 燈葵屋", "nameEn": "Eastmallow Estate - Light House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "東錦葵邨 - 花葵屋", "nameEn": "Eastmallow Estate - Flower House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "東錦葵海傍路", "nameEn": "Eastmallow Praya Road", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "東錦葵海傍路", "nameEn": "Eastmallow Praya Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "東錦葵邨 - 陽葵屋", "nameEn": "Eastmallow Estate - Sunny House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "東錦葵邨 - 燈葵屋", "nameEn": "Eastmallow Estate - Light House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "東錦葵邨 - 花葵屋", "nameEn": "Eastmallow Estate - Flower House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "中環橋", "nameEn": "Central Bridge", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "明月角", "nameEn": "Lunar Point", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "47",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "中環醫院, 陽光站, 東錦葵邨, 陽光大學, 北島花園 和 北頓花園",
            "viaDirectionEn": "Central Hospital, Sunshine Station, Eastmallow Estate, Sunshine University, North Island Estate and Norton Garden",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "05:00",
                        "lastTime": "01:00",
                        "interval": [
                            {"time": "05:00 - 01:00", "interval": "8 - 30"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "05:00",
                        "lastTime": "01:00",
                        "interval": [
                            {"time": "05:00 - 01:00", "interval": "8 - 30"}
                        ]
                    }
                }
            },
            "stops": {
                "A": [
                    {"seq": 1, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "新紀元中心", "nameEn": "Ping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "強生街市", "nameSubCn": "A05, 陽光大學南環校園", "nameEn": "Johnson Market", "nameSubEn": "A05, Sunshine University Southern Campus", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "中環南路", "nameEn": "Southern Central Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "東錦葵邨 - 陽葵屋", "nameEn": "Eastmallow Estate - Sunny House", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "陽光大學", "nameEn": "Sunshine University", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "北頓碼頭", "nameEn": "Norton Ferry Pier", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "北頓市中心", "nameEn": "Norton Town Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "北頓邨", "nameEn": "Norton Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "北頓花園", "nameEn": "Norton Garden", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "綠寶石中心", "nameEn": "Emerald Plaza", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "北頓路", "nameEn": "Norton Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "陽光大學", "nameEn": "Sunshine University", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "東錦葵大街", "nameEn": "Eastmallow Main Street", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "東錦葵海傍路", "nameEn": "Eastmallow Praya Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "中環南路", "nameEn": "Southern Central Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "南環街市", "nameEn": "Southern Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "中環（中日街）", "nameEn": "Central (Sun Central Street)", "visible": true, "stopFor": ["normal"]}
                ]
            }
        },
        {
            "route": "49A",
            "enabled": true,
            "bound": "A,B",
            "viaDirectionCn": "北島花園, 北環轉車站 和 中環醫院",
            "viaDirectionEn": "North Island Estate, Northern Interchange and Central Hospital",
            "shifts": {
                "normal": true
            },
            "shiftConfig": {
                "normal": {
                    "label": "普通班次",
                    "labelEn": "Regular Shift"
                }
            },
            "timetable": {
                "A": {
                    "normal": {
                        "firstTime": "06:00",
                        "lastTime": "00:50",
                        "interval": [
                            {"time": "06:00 - 00:50", "interval": "30"}
                        ]
                    }
                },
                "B": {
                    "normal": {
                        "firstTime": "06:00",
                        "lastTime": "00:50",
                        "interval": [
                            {"time": "06:00 - 00:50", "interval": "30"}
                        ]
                    }
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
                    {"seq": 8, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "落山邨", "nameEn": "Downhill Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "巨石路60號", "nameEn": "60 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "北島山頂", "nameEn": "North Island Hill Peak", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "巨石路35號", "nameEn": "35 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "巨石路20號", "nameEn": "20 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]}
                ],
                "B": [
                    {"seq": 1, "nameCn": "北灘", "nameEn": "Northern Beach", "visible": true, "stopFor": ["normal"]},
                    {"seq": 2, "nameCn": "巨石路20號", "nameEn": "20 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 3, "nameCn": "巨石路35號", "nameEn": "35 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 4, "nameCn": "北島山頂", "nameEn": "North Island Hill Peak", "visible": true, "stopFor": ["normal"]},
                    {"seq": 5, "nameCn": "巨石路60號", "nameEn": "60 Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 6, "nameCn": "巨石路", "nameEn": "Rocky Road", "visible": true, "stopFor": ["normal"]},
                    {"seq": 7, "nameCn": "北島花園", "nameEn": "North Island Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 8, "nameCn": "北島花園商場", "nameEn": "NIE Shopping Center", "visible": true, "stopFor": ["normal"]},
                    {"seq": 9, "nameCn": "望環台", "nameEn": "Panorama Heights", "visible": true, "stopFor": ["normal"]},
                    {"seq": 10, "nameCn": "落山邨", "nameEn": "Downhill Estate", "visible": true, "stopFor": ["normal"]},
                    {"seq": 11, "nameCn": "北環轉車站", "nameEn": "Northern Interchange", "visible": true, "stopFor": ["normal"]},
                    {"seq": 12, "nameCn": "楓樹里", "nameEn": "Maple Lane", "visible": true, "stopFor": ["normal"]},
                    {"seq": 13, "nameCn": "玻璃樓", "nameEn": "Glass Office", "visible": true, "stopFor": ["normal"]},
                    {"seq": 14, "nameCn": "The ONE", "nameEn": "", "visible": true, "stopFor": ["normal"]},
                    {"seq": 15, "nameCn": "強生街市", "nameEn": "Johnson Market", "visible": true, "stopFor": ["normal"]},
                    {"seq": 16, "nameCn": "南環中心", "nameEn": "The Southern", "visible": true, "stopFor": ["normal"]},
                    {"seq": 17, "nameCn": "中環醫院", "nameEn": "Central Hopsital", "visible": true, "stopFor": ["normal"]},
                    {"seq": 18, "nameCn": "陽光站", "nameEn": "Sunshine Station", "visible": true, "stopFor": ["normal"]},
                    {"seq": 19, "nameCn": "陽光碼頭", "nameEn": "Sunshine Pier", "visible": true, "stopFor": ["normal"]}
                ]
            }
        }
    ]
};
