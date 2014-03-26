/**
 * 
 */

/* The prefix of the id on the img element to use with imgAreaSelect */
var exeImgAreaPrefix = "mapselect";

function exeHandleImgAreaSelectFinish(img, selection) {
	var elId = "" + img.id;
	var blockId = elId.substring(exeImgAreaPrefix.length);
	var coordsId = img.getAttribute("data-for-mapselect-field");
	
	
	//alert("selection finished on " + img.id + " from " + selection.x1 + " block = "
	//		+ blockId + "coords = " + coordsId)
	$("#" + coordsId).val(selection.x1 +"," + selection.y1 + "," 
			+selection.x2 + "," + selection.y2);
}
