(function(){
    angular.module('barickOSApp')
    .service('tileManager', function () {
        
        var tileOrder = [],             //The order in which tiles should be drawn
            tiles = {},
            grids = {},                 //grids are smallest square unit of a tile, 1 grid = 1 small tile
            gridsPerRow = 0,            //no of grids in a row
            page_Width_Class = 'xs',    // possible values = xs, sm, md, lg
            small_tile_size = 0,
            medium_tile_size = 0,
            big_tile_size = 0,
            clearSpaceDivPosition = 200,  //max vertical point (y px`) where tile ends
            colorCodes = ["#632F00", "#B01E00", "#C1004F", "#4617B4", "#008287", "#199900", "#00C13F", "#FF2E12", "#FF1D77", "#AA40FF", "#1FAEFF", "#000", "#00A3A3", "#FE7C22"];
            
        
        this.tilify = function (TM) {
            tiles = TM.tiles;
            tileOrder = TM.tileOrder;
            
            calculateWidths();
            noBigTileInXS();
            makeGrids();        
            mapTilesToGrid();
            
            TM.tiles = tiles;
            TM.tileOrder = tileOrder;
            return TM;
        };
        
        
        this.reTilify = function (TM) {
            tiles = TM.tiles;
            tileOrder = TM.tileOrder;
            console.log("tileOrder: " + JSON.stringify(tileOrder));
            resetGrids();
            mapTilesToGrid();
            
            TM.tiles = tiles;
            TM.tileOrder = tileOrder;
            return TM;
        };
        
        this.getClearSpaceDivPosition = function () { return clearSpaceDivPosition;};

        this.getGrids =  function () { return grids;};
        
                
    /*
    * calculate height and width of the tiles depending on the tiles_container width
    */
    function calculateWidths () {        
        var scrollBarWidth = 17;                                    //17px for scrollbar
        //var tiles_Container_width = $('.tiles-container').width() - scrollBarWidth;
        var tiles_Container_width = angular.element('.tiles-container').width() - scrollBarWidth;
        page_Width_Class = 'xs';
        var all_Possible_Width_Classes = 'xs sm md lg';        
        gridsPerRow = 12;
        small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);        
        
        if (tiles_Container_width >= 1200) {            
            page_Width_Class = 'lg';
            gridsPerRow = 16;
            small_tile_size = Math.floor(tiles_Container_width / gridsPerRow);
        } 
        else if (tiles_Container_width >= 992) {
            page_Width_Class = 'md';
        } 
        else if (tiles_Container_width >= 768) {
            page_Width_Class = 'sm';            
        } 
        else {
            page_Width_Class = 'xs';   
            gridsPerRow = 4;
            small_tile_size = Math.floor((tiles_Container_width + scrollBarWidth) / gridsPerRow);
        }
        
        medium_tile_size = small_tile_size * 2;
        big_tile_size = medium_tile_size * 2;
    }
    
    /*
    * In Mobile, all big tiles should be converted to medium
    */
    function noBigTileInXS () {
        if(page_Width_Class == "xs") {
            for(var i in tiles) {
                tiles[i].size = (tiles[i].size == "big") ? "medium" : tiles[i].size;
            }
        }
    }
        
    /*
    * makeGrids will make the grids i.e. divide the page into smallest squares
    */
    function makeGrids () {
        //let's calculate total filling capacity in terms of smallest squares or grids
        fillCapacity = 0;
        for (var i in tiles) {
            if (tiles[i].size == "small") {
                fillCapacity += 1;
            } else if (tiles[i].size == "medium") {
                fillCapacity += 4;
            } else if (tiles[i].size == "rectangle") {
                fillCapacity += 8;
            }else if (tiles[i].size == "big") {
                fillCapacity += 16;
            }
        }
        
        //let's make total no grids be multiple gridsPerRow
        //Doubling the grids
        var totalGrids = gridsPerRow * Math.ceil(fillCapacity/gridsPerRow) * 2;
        
        //Let's make the grids
        grids = {};
        var gridX = 0;
        var gridY = 1;
        for (var i = 1; i <= totalGrids; i++) {
            gridX++;
            
            if(gridX > gridsPerRow) {
                gridX = 1;
                gridY++;
            }
            
            var grid = {};
            grid.indX = gridX;
            grid.indY = gridY;
            grid.id = gridX + "x" + gridY;
            grid.occupiedBy = "none";
            grid.top = (gridY - 1) * small_tile_size;
            grid.left = (gridX - 1) * small_tile_size;
            grid.type = '';     //if any tile starts on it, then type=startGrid
            
            grids[grid.id] = grid;
        }
    }  
        
    /*
    * This function will reset the Grids
    */
    function resetGrids () {
        for(var key in grids) {
            grids[key].occupiedBy = "none";
            grids[key].type = '';
        }
    }    
        
    /*
    * this function will loop thru tiles, send each tile to placeTileOnGrid(tile) 
    * and will receive the starting grid id and will store that grid id on that tile object
    * We also calculate a clearSpaceDivPosition bottom all the tiles, since tiles are position absolute
    * there is nothing to push the browser scroll so that all the ttiles are visible
    *
    * Edit 1: send the tiles as per their order defined in tileOrder
    */
    function mapTilesToGrid () {
        clearSpaceDivPosition = 0;
        var tileID = '';
        for (var j in tileOrder) {
            //console.log("sending for tile id="+tiles[i].id);
            tileID = tileOrder[j];
            gridId = placeTileOnGrid (tiles[tileID]);
            tiles[tileID].gridId = gridId;

            tiles[tileID].width = (tiles[tileID].size == "small") ? small_tile_size : ((tiles[tileID].size == "medium") ? medium_tile_size : big_tile_size);
            tiles[tileID].height = (tiles[tileID].size == "small") ? small_tile_size : ((tiles[tileID].size == "big") ? big_tile_size : medium_tile_size);            
            tiles[tileID].bgColor = tiles[tileID].bgColor || colorCodes[Math.floor(Math.random()*colorCodes.length)];
            tiles[tileID].top = grids[gridId].top;
            tiles[tileID].left = grids[gridId].left;

            clearSpaceDivPosition = ((tiles[tileID].top+tiles[tileID].height) > clearSpaceDivPosition) ? (tiles[tileID].top+tiles[tileID].height) : clearSpaceDivPosition; 
        }

        //TM.clearSpaceDivPosition = clearSpaceDivPosition;
    }
    
    /*
    * This function will loop thru the grid in grids
    * looking for a vacant grid where it can place the tile
    * if the place is of q^2 size, it will also have to look more (q-1) cells on right
    * and (q-1) cells on right
    * once found, the tileId should be stored on all the applicable grids
    */
    function placeTileOnGrid(tile) {        
        for(var key in grids) {
            if (grids[key].occupiedBy == "none") {
               if (tile.size == "small") {
                   grids[key].occupiedBy = tile.id;
                   grids[key].type = 'startGrid';
                   //console.log(key + " is will hold " + tile.size + " tile id="+tile.id);
                   return(key);
               } else {
                   if (canItHoldTile(grids[key].id, tile.size)) {
                       markGridsOccupied(grids[key].id, tile.size, tile.id);
                       grids[key].type = 'startGrid';
                       return(key);
                   }
               }
            }
        }
        console.log('No Grid Avaialble for Tile id='+tile.id);
    }
    
    /*
    * This function will take a gridId and examine
    * that grid can be an elligible starting grid for
    * a given tile size
    */    
    function canItHoldTile(gridId, tileSize) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle
        
        var startX = grids[gridId].indX;
        var startY = grids[gridId].indY;
        var uptoX = startX + (x-1);
        var uptoY = startY + (y-1);
        var key = '';
        var innerLoopFailed = false;
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                if(grids[key] == undefined || typeof(grids[key]) == undefined || grids[key].occupiedBy != "none") {
                    innerLoopFailed = true;
                    break;
                }                
            }
            if(innerLoopFailed) {
                break;
            }            
        }
        return !innerLoopFailed;
    }
    
    
    /*
    * this function will mark all the grids occupied
    * by a medium or big tile
    */
    function markGridsOccupied (gridId, tileSize, tileId) {
        var x = (tileSize == "medium") ? 2 : 4; // medium is 2x2, big is 4x4, rectangle is 4x2
        var y = (tileSize == "big") ? 4 : 2;    // y is 4 for big, 2 for medium and rectangle
        
        var startX = grids[gridId].indX;
        var startY = grids[gridId].indY;
        var uptoX = startX + (x-1);
        var uptoY = startY + (y-1);
        var key = '';
        for (var i = startX; i <= uptoX; i++) {
            for (var j = startY; j <= uptoY; j++) {
                key = i + "x" + j;
                grids[key].occupiedBy = tileId;
            }
        }
    }
        
    });
})()