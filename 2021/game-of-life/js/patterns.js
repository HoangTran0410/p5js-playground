// https://www.conwaylife.com/wiki/Conway%27s_Game_of_Life
const PATTERN = {
    // https://www.conwaylife.com/wiki/Oscillator
    Oscillator: {
        Pinwheel:
            '12,12,6b2o4b$6b2o4b2$4b4o4b$2obo4bo3b$2obo2bobo3b$3bo3b2ob2o$3bobo2bob2o$4b4o4b2$4b2o6b$4b2o!',
        'Octagon 2':
            '8,8,3b2o3b$2bo2bo2b$bo4bob$o6bo$o6bo$bo4bob$2bo2bo2b$3b2o!',
        'P35 Honey Farm Hassler':
            '24,17,20b2o$11bo7bobo$9b3o8bo$8bo$8b2o$15bo$15bobo$16b3o3b2o$2o20b2o$2o3b3o$6bobo$8bo$14b2o$15bo$3bo8b3o$2bobo7bo$2b2o!',
        'Merzentichs P31':
            '24,13,7b2obo2bob2o7b$2o4bo2bo4bo2bo4b2o$2o5bobo4bobo5b2o$8bo6bo8b6$8bo6bo8b$2o5bobo4bobo5b2o$2o4bo2bo4bo2bo4b2o$7b2obo2bob2o!',
    },

    // https://conwaylife.com/wiki/Category:Agars
    Agars: {
        'Lone dot agar':
            '38,38,4b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o$4bo2bobo2bo2bobo2bo2bobo2bo2bobo$5bo7bo7bo7bo$8bo7bo7bo7bo$2o2bobo5bobo5bobo5bobo5b2o$obo5bobo5bobo5bobo5bobo2bo$4bo7bo7bo7bo7bo$bo7bo7bo7bo7bo$o2bobo5bobo5bobo5bobo5bobo$2o5bobo5bobo5bobo5bobo2b2o$5bo7bo7bo7bo$8bo7bo7bo7bo$2o2bobo5bobo5bobo5bobo5b2o$obo5bobo5bobo5bobo5bobo2bo$4bo7bo7bo7bo7bo$bo7bo7bo7bo7bo$o2bobo5bobo5bobo5bobo5bobo$2o5bobo5bobo5bobo5bobo2b2o$5bo7bo7bo7bo$8bo7bo7bo7bo$2o2bobo5bobo5bobo5bobo5b2o$obo5bobo5bobo5bobo5bobo2bo$4bo7bo7bo7bo7bo$bo7bo7bo7bo7bo$o2bobo5bobo5bobo5bobo5bobo$2o5bobo5bobo5bobo5bobo2b2o$5bo7bo7bo7bo$8bo7bo7bo7bo$2o2bobo5bobo5bobo5bobo5b2o$obo5bobo5bobo5bobo5bobo2bo$4bo7bo7bo7bo7bo$bo7bo7bo7bo7bo$o2bobo5bobo5bobo5bobo5bobo$2o5bobo5bobo5bobo5bobo2b2o$5bo7bo7bo7bo$8bo7bo7bo7bo$4bobo2bo2bobo2bo2bobo2bo2bobo2bo$4b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o!',
    },

    // https://conwaylife.com/wiki/Category:Wicks
    Wick: {
        'Waveguide 1':
            '53,21,b2o50b$o2bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bob$4bobobobobobobobobobobobobobobobobobobobobobobobobo$o2bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bob$b3o49b$2b2o49b$2b2o49b$3bo49b$3bo49b$3bo49b$3bo49b$3bo49b$3bo49b$3bo49b$2b2o49b$2b2o49b$b3o49b$o2bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bob$4bobobobobobobobobobobobobobobobobobobobobobobobobo$o2bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bo3bob$b2o!',
        Washerwoman:
            '56,5,o55b$2o4bo5bo5bo5bo5bo5bo5bo5bo5bob$3o2bobo3bobo3bobo3bobo3bobo3bobo3bobo3bobo3bobo$2o4bo5bo5bo5bo5bo5bo5bo5bo5bob$o!',
        'Beehive fuse':
            '30,32,2ob2o25b$o3bo25b$b3o26b3$3b2o25b$2bo2bo24b$3b2o25b6$7bo22b$6bobo21b$6bobo21b$7bo22b$15b2o13b$14bo2bo12b$15b2o13b6$19bo10b$18bobo9b$18bobo9b$19bo10b$27b2ob$26bo2bo$27b2o!',
        'Bi-block Fuse':
            '47,5,2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o$2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2obo2bo$44b2o$2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o$2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o2b2o!',
    },

    // https://www.conwaylife.com/wiki/Category:Guns
    Gun: {
        Glider: '3,3,bo$2bo$3o!',
        AK94:
            '38,25,7bo7bo7b2o$7b3o5b3o5b2o$10bo7bo$9b2o6b2o16b2o$30b2o2bo2bo$30bobo2b2o$33b2o$5bo28bo$5b3o26bob2o$8bo22b2obo2bo$7b2o22b2ob2o3$17bo$2b2ob2o9bobo10b2o$o2bob2o8bo3bo9bo$2obo11bo3bo10b3o$3bo11bo3bo12bo$3b2o11bobo$b2o2bobo9bo$o2bo2b2o$b2o16b2o$19bo$13b2o5b3o$13b2o7bo!',
        'Gospher Glider Gun':
            '36,9,24bo11b$22bobo11b$12b2o6b2o12b2o$11bo3bo4b2o12b2o$2o8bo5bo3b2o14b$2o8bo3bob2o4bobo11b$10bo5bo7bo11b$11bo3bo20b$12b2o!',
        'B-52 bomber':
            '39,21,b2o36b$b2o17bo18b$19bobo12bobo2b$20bo12bo5b$2o7b2o23bo2bob$2obo5b2o23bobobo$3bo23bo7bo2bo$3bo23b2o7b2ob$o2bo17b2o5bo10b$b2o18bo17b$21b3o15b$36b2ob$36b2ob$b2o36b$o2bo35b$obobo16bobo4b2o5b2o2b$bo2bo17b2o4b2o5b2obo$5bo12bo3bo15bo$2bobo12bobo18bo$18bo16bo2bo$36b2o!',
        'Bi-gun':
            '50,15,11bo38b$10b2o38b$9b2o39b$10b2o2b2o34b$38bo11b$38b2o8b2o$39b2o7b2o$10b2o2b2o18b2o2b2o10b$2o7b2o39b$2o8b2o38b$11bo38b$34b2o2b2o10b$39b2o9b$38b2o10b$38bo!',
        'Simkin glider gun':
            '33,21,2o5b2o$2o5b2o2$4b2o$4b2o5$22b2ob2o$21bo5bo$21bo6bo2b2o$21b3o3bo3b2o$26bo4$20b2o$20bo$21b3o$23bo!',
        'Vacuum gun':
            '49,43,b2o23b2o21b$b2o23bo22b$24bobo22b$15b2o7b2o23b$2o13bobo31b$2o13bob2o30b$16b2o31b$16bo32b$44b2o3b$16bo27b2o3b$16b2o31b$2o13bob2o13bo3bo12b$2o13bobo13bo5bo7b2o2b$15b2o14bo13b2o2b$31b2o3bo12b$b2o30b3o13b$b2o46b$33b3o13b$31b2o3bo12b$31bo13b2o2b$31bo5bo7b2o2b$32bo3bo12b2$44b2o3b$44b2o3b5$37b2o10b$37bobo7b2o$39bo7b2o$37b3o9b$22bobo24b$21b3o25b$21b3o25b$21bo15b3o9b$25bobo11bo9b$21b2o4bo9bobo9b$16b2o4bo3b2o9b2o10b$15bobo6bo24b$15bo33b$14b2o!',
        'Newgun 1':
            '36,34,25b2o5b2o$25b2o5b2o8$26bo5bo$25b3o3b3o$24b2obo3bob2o3$27bo3bo$27bo3bo7$33bo$10b2o22b2o$2o7bobo21b2o$2o7bo$9b3o4$9b3o$2o7bo17b2o$2o7bobo15b2o$10b2o!',
        'P46 gliderless LWSS gun':
            '40,42,23b2o$23bo$17b2ob2obo$15bo2bobobo$15b2o4bo13bo$33b3o$32bo$32b2o2$12b2o$11bobo5b2ob2o7b2o$10bo7b2o3b2o6b2o$9bo9b2ob2o$9b2o9b3o$21bo$3b2o$4bo$2bo$2b2o2$2b2o7bobo2bobo11bo2bo$2bobo6bo2bo3bo15bo$3bo5b2o3bobobo11bo3bo$3o7b3obo16b4o$o6b2o5b2o$7b2o4b2o$7b2o3bo$7b2obobo$7b2obobo2$24b3o8b2o$10b2o12bobo8b2o$6b2o2b2o5b2o5bobo$5bobo8bobo$5bo10bo19b2o$4b2o9b2o19bo$37b3o$19b2o4bo13bo$19bo2bobobo$21b2ob2obo$27bo$27b2o!',
        'P46 gliderless MWSS gun':
            '40,29,6bo$6b3o$9bo$8b2o$2b2o$3bo$2bo$2b2o2$2b2o7bobo2bobo$2bobo6bo2bo3bo$3bo5b2o3bobobo$3o7b3obo$o6b2o5b2o8b3o$7b2o4b2o8bo3bo$7b2o3bo9bo5bo$7b2obobo8bo3bo3bo$7b2obobo8bo7bo5b2o$21bobo3bobo5b2o$17b2o3b2o3b2o$10b2o4bobo$6b2o2b2o4bo19b2o$5bobo7b2o19bo$5bo31b3o$4b2o19bo13bo$19b2obobobo$19bob2ob2obo$27bo$27b2o!',
    },

    // https://www.conwaylife.com/wiki/Spaceship
    Spaceship: {
        'P15 pre-pulsar spaceship':
            '61,43,3b3o10b3o23b3o10b3o3b$4bobo8bobo25bobo8bobo4b$6bo8bo29bo8bo6b$bob5o6b5obo19bob5o6b5obob$bob2o3b2o2b2o3b2obo19bob2o3b2o2b2o3b2obob$2o5b3o2b3o5b2o17b2o5b3o2b3o5b2o$5b2ob2o2b2ob2o27b2ob2o2b2ob2o5b2$4bo12bo25bo12bo4b$5b3o6b3o27b3o6b3o5b$4b4o6b4o25b4o6b4o4b$3b2o12b2o23b2o12b2o3b$4bo12bo25bo12bo4b$2b3o12b3o21b3o12b3o2b$2bo16bo21bo16bo2b$5bo10bo27bo10bo5b$3bobo10bobo23bobo10bobo3b$2bo3b2o6b2o3bo21bo3b2o6b2o3bo2b$3bo5bo2bo5bo23bo5bo2bo5bo3b$9bo2bo35bo2bo9b$bob2o4bo2bo4b2obo19bob2o4bo2bo4b2obob$bo3b3obo2bob3o3bo19bo3b3obo2bob3o3bob$2bo6bo2bo6bo21bo6bo2bo6bo2b$bo2b2o3bo2bo3b2o2bo19bo2b2o3bo2bo3b2o2bob$bo2b2obobo2bobob2o2bo19bo2b2obobo2bobob2o2bob$5bo2bo4bo2bo27bo2bo4bo2bo5b$6bobo4bobo29bobo4bobo6b$27bo5bo27b$4b2obob4obob2o9bo5bo9b2obob4obob2o4b$10b2o14bobo3bobo14b2o10b$2bob2o10b2obo7bo5bo7bob2o10b2obo2b$2o2bo3b2o2b2o3bo2b2o5bo5bo5b2o2bo3b2o2b2o3bo2b2o$b2obo12bob2o19b2obo12bob2ob$3b2obo8bob2o23b2obo8bob2o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$b2o2bo2bo4bo2bo2b2o4b2o7b2o4b2o2bo2bo4bo2bo2b2ob$bo5b2o4b2o5bo5bobo3bobo5bo5b2o4b2o5bob$b3o3bo6bo3b3o6bo5bo6b3o3bo6bo3b3ob$3b4o8b4o23b4o8b4o3b$4bo2bo6bo2bo25bo2bo6bo2bo4b$4bo12bo25bo12bo4b$4bob2o6b2obo25bob2o6b2obo4b$5bo10bo27bo10bo!',
        Loafer: '9,9,b2o2bob2o$o2bo2b2o$bobo$2bo$8bo$6b3o$5bo$6bo$7b2o!',
        'Lwss tagalong':
            '25,19,21bo3b$18b4o3b$13bo2bob2o5b$13bo11b$4o8bo3bob2o5b$o3bo5b2ob2obobob5o$o9b2obobobo2b5o$bo2bo2b2o2bo3b3o2bob2ob$6bo2bob2o12b$6bo4b2o12b$6bo2bob2o12b$bo2bo2b2o2bo3b3o2bob2ob$o9b2obobobo2b5o$o3bo5b2ob2obobob5o$4o8bo3bob2o5b$13bo11b$13bo2bob2o5b$18b4o3b$21bo!',
        Orion:
            '14,15,3b2o9b$3bobo8b$3bo10b$2obo10b$o4bo8b$ob2o6b3ob$5b3o4b2o$6b3obobob$13bo$6bobo5b$5b2obo5b$6bo7b$4b2obo6b$7bo6b$5b2o!',
        '2-engine Cordership':
            '41,49,19b2o$19b4o$19bob2o2$20bo$19b2o$19b3o$21bo$33b2o$33b2o7$36bo$35b2o$34bo3bo$35b2o2bo$40bo$37bobo$38bo$38bo$38b2o$38b2o3$13bo10bo$12b5o5bob2o11bo$11bo10bo3bo9bo$12b2o8b3obo9b2o$13b2o9b2o12bo$2o13bo21b3o$2o35b3o7$8b2o$8b2o11b2o$19b2o2bo$24bo3bo$18bo5bo3bo$19bo2b2o3bobo$20b3o5bo$28bo!',
        Spider:
            '27,8,9bo7bo9b$3b2obobob2o3b2obobob2o3b$3obob3o9b3obob3o$o3bobo5bobo5bobo3bo$4b2o6bobo6b2o4b$b2o9bobo9b2ob$b2ob2o15b2ob2ob$5bo15bo!',
        Copperhead:
            '8,12,b2o2b2o$3b2o$3b2o$obo2bobo$o6bo2$o6bo$b2o2b2o$2b4o2$3b2o$3b2o!',
        Weekender:
            '16,11,bo12bob$bo12bob$obo10bobo$bo12bob$bo12bob$2bo3b4o3bo2b$6b4o6b$2b4o4b4o2b2$4bo6bo4b$5b2o2b2o!',
        Soba:
            '31,40,9bo11bo$8bo13bo$10bo9bo$7bobo11bobo$5bo19bo$7bo4b2o3b2o4bo$3ob2o2bo2bo7bo2bo2b2ob3o$8b2o11b2o$2b3obob2o11b2obob3o$o7bo13bo7bo$2b2o5bob3o3b3obo5b2o$2bo6b3obo3bob3o6bo$3b3o8bobo8b3o$15bo$6bo17bo$5b2o17b2o$5bo6bo5bo6bo$b2o8bo7bo8b2o$o2b2o5bo9bo5b2o2bo$o12bo3bo12bo$5bo6b2o3b2o6bo$bo9b3o3b3o9bo$bo3bo19bo3bo$2bo3b2o4bobobobo4b2o3bo$3b3o7b2ob2o7b3o$7b2obo3bobo3bob2o$7b2ob3o5b3ob2o$8bo4bo3bo4bo$4bo4b4o5b4o4bo$4bo4bo11bo4bo$9bo11bo$12bo5bo$4b3o3b5ob5o3b3o$5b2o2bo3b2ob2o3bo2b2o$5bo3b2ob3ob3ob2o3bo$6b3o3bo5bo3b3o$6bo3b2o7b2o3bo$6bobo3bo5bo3bobo$7bo3bo7bo3bo$8b3o9b3o!',
        Lobster:
            '26,26,11b3o$13bo$8b2o2bo$8b2o$12b2o$11b2o$10bo2bo2$8bo2bo$7bo3bo$6bob3o$5bo$5bo13bobo2b2o$6bo13b2obobo$b2o13b2o2bo4bo$o2b2o2b2o6bo3bo$5bo2bo6bo6b2o$9b2o4bobo4b2o$2bo3bo3bo5bo$6b2o4bo2bo$bobo5bo3b2o$2o8bo$5bo4bo$7bo3bo$4b2o5bo$4bo5bo!',
        '58P5H1V1':
            '23,23,20b2ob$20b2ob$19bo2bo$16b2obo2bo$22bo$14b2o3bo2bo$14b2o5bob$15bob5ob$16bo6b3$13b3o7b$13bo9b$11b2o10b$5b2o4bo11b$5b3o3bo11b$3bo4bo14b$3bo3bo15b$7bo15b$2b2obobo15b$2o5bo15b$2o4b2o15b$2b4o!',
        '56P6H1V0':
            '26,12,5b3o10b3o5b$3obo7b2o7bob3o$4bo3bo2bo2bo2bo3bo4b$4bo5bo4bo5bo4b$10b2o2b2o10b$7bo3bo2bo3bo7b$7bobo6bobo7b$8b10o8b$10bo4bo10b$8bo8bo8b$7bo10bo7b$8bo8bo!',
        '25P3H1V0.1':
            '16,5,7b2obo5b$4b2obob2ob3ob$b4o2b2o6bo$o4bo3bo3b2ob$b2o!',
        '37P4H1V0':
            '19,12,bo$bo8bo$obo5bo3bo$8bo3b2o$5bob2o5b2o$b6o2bo6bo$2b2o6bo3b3o$10bo3bob2o$13bo$18bo$17bo$17bo!',
        'My Discovery': '5,4,b4o$o3bo$4bo$o2bob$',
    },

    // https://conwaylife.com/wiki/Category:Puffers
    Puffer: {
        'Slow puffer 1':
            '82,73,76b2o4b$75b2ob4o$76b6o$77b4ob$64b3o15b$63b5o14b$62b2ob3o14b$52b2o9b2o17b$51b2ob4o24b$52b6o24b$53b4o25b3$44b2o36b$43b2ob2o26b2o6b$44b4o24bo4bo4b$45b2o24bo10b$24b6o41bo5bo4b$24bo5bo40b6o5b$24bo57b$25bo4bo51b$27b2o53b2$54b4o24b$53b6o23b$52b2ob4o23b$3bo49b2o27b$bo3bo76b$o81b$o4bo76b$5o77b3$20bo61b$b2o10b2obo2bobo60b$2ob3o6bobob4obo60b$b4o3b3obo69b$2b2o8bobob4obo60b$13b2obo2bobo60b$5b2o13bo61b$3bo4bo73b$2bo79b$2bo5bo73b$2b6o74b3$53b2o27b$52b2ob4o23b$53b6o23b$54b4o24b2$27b2o53b$25bo4bo51b$24bo57b$24bo5bo40b6o5b$24b6o41bo5bo4b$45b2o24bo10b$44b4o24bo4bo4b$43b2ob2o26b2o6b$44b2o36b3$53b4o25b$52b6o24b$51b2ob4o24b$52b2o9b2o17b$62b2ob3o14b$63b5o14b$64b3o15b$77b4ob$76b6o$75b2ob4o$76b2o!',
        'Slow puffer 2':
            '22,21,3bo9b2o7b$bo3bo6b2ob3o4b$o12b5o4b$o4bo8b3o5b$5o17b3$20bob$b2o10b2obo2bobo$2ob3o6bobob4obo$b4o3b3obo9b$2b2o8bobob4obo$13b2obo2bobo$5b2o13bob$3bo4bo13b$2bo19b$2bo5bo13b$2b6o6b3o5b$13b5o4b$12b2ob3o4b$13b2o!',
        'Blinker puffer 1':
            '9,18,3bo5b$bo3bo3b$o8b$o4bo3b$5o4b4$b2o6b$2ob3o3b$b4o4b$2b2o5b2$5b2o2b$3bo4bo$2bo6b$2bo5bo$2b6o!',
        Pufferfish:
            '15,12,3bo7bo$2b3o5b3o$b2o2bo3bo2b2o$3b3o3b3o2$4bo5bo$2bo2bo3bo2bo$o5bobo5bo$2o4bobo4b2o$6bobo$3bobo3bobo$4bo5bo!',
        'Space rake':
            '22,19,11b2o5b4o$9b2ob2o3bo3bo$9b4o8bo$10b2o5bo2bob2$8bo13b$7b2o8b2o3b$6bo9bo2bo2b$7b5o4bo2bo2b$8b4o3b2ob2o2b$11bo4b2o4b4$18b4o$o2bo13bo3bo$4bo16bo$o3bo12bo2bob$b4o!',
        'Frothing puffer':
            '33,23,7bo17bo$6b3o15b3o$5b2o4b3o5b3o4b2o$3b2obo2b3o2bo3bo2b3o2bob2o$4bobo2bobo3bobo3bobo2bobo$b2obobobobo4bobo4bobobobob2o$b2o3bobo4bo5bo4bobo3b2o$b3obo3bo4bobobo4bo3bob3o$2o9b2obobobob2o9b2o$12bo7bo$9b2obo7bob2o$10bo11bo$7b2obo11bob2o$7b2o15b2o$7bobobob3ob3obobobo$6b2o3bo3bobo3bo3b2o$6bo2bo3bobobobo3bo2bo$9b2o4bobo4b2o$5b2o4bo3bobo3bo4b2o$9bob2obo3bob2obo$10bobobobobobobo$12bo2bobo2bo$11bobo5bobo!',
        'Hivenudger 2':
            '30,27,9bobo18b$8bo2bo18b$7b2o21b$6bo3bo19b$5b3obo20b$2b2o26b$bo3b5o7b4o5bo2bo$o3bo12bo3bo3bo4b$o5b2o9bo7bo3bo$3o3b4o8bo2bo3b4ob$bo7bo20b$b2o19b2o6b$bobo18b2o6b$b2o2b2obo8bobo2b2o6b$2bob3obo3bob4obo2b2o6b$9b2obob2o2bo3b2o3b3o$4b6ob2o3b4o2b2o3b3o$5bo4b3o6bo2b2o3b3o$6b2o5b2o2b2o3b2o6b$7bo2bo5b4o2b2o6b$8bobob2o5bo2b2o6b$22b2o6b2$18bo2bo3b4ob$17bo7bo3bo$17bo3bo3bo4b$17b4o5bo2bo!',
    },

    // https://conwaylife.com/wiki/Garden_of_Eden#Records
    'Garden of Eden': {
        'Garden of Eden 1':
            '33,9,33o$2obob3ob3ob2obobobobobobobobobo$obob3ob3ob4ob3obobobobobobob$5ob3ob3ob4ob14o$obob2ob3ob3obob3obobobobobobob$4ob3ob3ob5ob2obobobobobobo$b2ob3ob3ob3obobob13o$2ob2ob3ob3ob2ob4obobobobobobo$18ob14o!',
        'Garden of Eden 5':
            '11,11,b3o2b2o3b$b2obobob3o$b3o2b5o$obobobobobo$4obobobob$4b3o4b$bobobob4o$obobobobobo$5o2b3ob$3obobob2ob$3b2o2b3o!',
        'Garden of Eden 45 Cells':
            '11,11,3b2o3bo$2bo2bobobo$bobo2bo3bo$obobo2bobo$o2bobo2bo$bo2b3o2bo$2bo2bobo2bo$bobo2bobobo$o3bo2bobo$bobobo2bo$2bo3b2o!',
    },
};

const PATTERN_CONVERTER = {
    RLEToArray: (rle) => {
        let split_comma = rle.split(',');
        let x = split_comma[0];
        let y = split_comma[1];

        let pat = split_comma[2].slice(0, -1); // remove exclamation mark !

        // init result
        let result = [];
        for (let row = 0; row < y; row++) {
            result[row] = [];
        }

        // convert rle
        let readed = '';
        let row_index = 0;

        for (let i = 0; i < pat.length; i++) {
            // is number ?
            if (!isNaN(Number(pat[i]))) {
                readed += pat[i];
            }

            // is text?
            else {
                // get num
                let num;
                if (readed == '') num = 1;
                else num = Number(readed);

                // reset readed
                readed = '';

                // add to result array
                while (num--) {
                    // dead cell
                    if (pat[i] == 'b') {
                        result[row_index].push(DEAD);
                    }
                    // alive cell
                    else if (pat[i] == 'o') {
                        result[row_index].push(ALIVE);
                    }
                    // row
                    else if (pat[i] == '$') {
                        row_index++;
                    }
                }
            }
        }

        return result;
    },
    arrayToRLE: (arr) => {},
};

// https://stackoverflow.com/a/15106541/11898496
function randomProperty(obj) {
    var keys = Object.keys(obj);
    return obj[keys[(keys.length * Math.random()) << 0]];
}

function getRandomPattern() {
    return randomProperty(randomProperty(PATTERN));
}

function fillPatternToWorld(world, RLEpattern) {
    let grid_pattern = PATTERN_CONVERTER.RLEToArray(RLEpattern);

    // calculate to fill to center world
    let atRow = floor(world.length / 2) - floor(grid_pattern.length / 2);
    let atCol = floor(world[0].length / 2) - floor(grid_pattern[0].length / 2);

    // fill data
    for (let row = 0; row < grid_pattern.length; row++) {
        for (let col = 0; col < grid_pattern[row].length; col++) {
            if (world[row + atRow]) {
                world[row + atRow][col + atCol] = grid_pattern[row][col];
            }
        }
    }
}

function addPatternsToSelectElement() {
    let selectEle = document.querySelector('select#pattern');

    for (let category in PATTERN) {
        let cate = document.createElement('optgroup');
        cate.label = category;
        selectEle.appendChild(cate);

        for (let pat in PATTERN[category]) {
            let opt = document.createElement('option');
            opt.innerHTML = pat;
            opt.value = PATTERN[category][pat];
            cate.appendChild(opt);
        }
    }
}
