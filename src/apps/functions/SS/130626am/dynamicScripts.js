var default_ex, iframeV, colRef;
var gidArray, geomArray, geomEdit;
geomEdit = -1;
function dynaToggleCols(tables, colNoStr) {
	var colref1, colref2, head1, overMax, indexRef, i, ArrRef, EndRef, stylerules;
	
	var refreshT = -1; //Always doing this on this script
	colRef = refreshT; //We need a full stylesheet refresh after an update; specify -1
	if (refreshT == -1) {
		document.getElementById('colNo').value = colNoStr;
	}
	
	//The iframe should now exist, lets define it for later; this variable is global.
	iframeV = document.getElementById('Attributes Query'); //This is now a DIV
	
	//Set these variables here
	dir = document.getElementById('dir').value;
	maxCol = document.getElementById('maxCol').value;
	
	//Pick up the colNo
	var tokensC = colNoStr.split('|');
	
	//Loop through all tables and call the refresh
	for (i=0;i<tables;i++){
		colNo = parseInt(tokensC[i]);
		SetUpToggleCols(dir, colNo, maxCol, i); 
	}
	if (refreshT == -1) {
		colRef = 0; //We have set up the table so now we reset this to zero
		refreshT = 0;
	}
}

function dynaScriptToggleCols(dir, colNo, maxCol, tableNo) {
	//Set these variables here
	document.getElementById('dir').value = dir;
	document.getElementById('maxCol').value = maxCol;
	
	//Pick up the colNo
	colNo = document.getElementById('colNo').value;
	var tokensC = colNo.split('|');
	colNo = parseInt(tokensC[tableNo]);
	
	SetUpToggleCols(dir, colNo, maxCol, tableNo); 
}

function photoswitch(){
	var currState;
	currState = document.getElementById('photoscroller').style.visibility;
	if (currState == 'visible'){
		document.getElementById('photoscroller').style.visibility = 'hidden';
		photoactive = false;
	} else {
		document.getElementById('photoscroller').style.visibility = 'visible';
		photoactive = true;
	}
}

function specialT(table, action, gid) {
	tableHTML = table + '.php?table=' + table + '&action=' + action + '&gid=' + gid;
	updateTable(tableHTML, 'override');
	document.getElementById('urlS').value = tableHTML;
}

function validateForm() {
	//Return true if the form validates
	var who;
	who = document.getElementById('username').value; 
	if (who == "" || who == 'UNKNOWN') {
		alert('We need more information about who you are!');
	} else {
		return true;
	}
}

function resetView(table, recNo, lower, filter) {
	/*This is the only script that doesn't get the recNo, lower and filter from the document elements
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	filter = document.getElementById('filterS').value;*/
	
	document.getElementById('recnoS').value = recNo;
	document.getElementById('lowerS').value = lower;
	
	if (!filter) {
		document.getElementById('filterS').value = filter;
		updateTable();
	} else {
		document.getElementById('filterS').value = '';
		updateTable();
	}
}

function tableFilter(tablename){
	east2.expand();
	var selectOptions = document.getElementById('fm1');
	
	for (i=0;i<selectOptions.options.length;i++){
		if (selectOptions.options[i].value=="~T~"+tablename){
			selectOptions.selectedIndex = i;
		}
	}
	var optionV = "~T~"+tablename;
	filterSetup(optionV); //Run the filter setup
}

var fieldNameA, fieldOpA, fieldValA, fieldTA, linkOpA, preA, preB, postA, postB, rLen, iLen, opA;
fieldNameA = [];
fieldOpA = [];
fieldValA = [];
fieldTA = [];
linkOpA = [];
preA = [];
preB = [];
postA = [];
postB = [];

opA = ['Equal', 'Not equal', 'Greater than', 'Less than', 'Greater than or equal', 'Less than or equal', 'LIKE', 'BETWEEN'];

var filterUserString, filterURLString, filterSQLString, filterCQLString, WFSfilter;
filterUserString = "";
filterSQLString = "";
filterCQLString = "";

function fieldTupdate(opt,tableRef) {
	var fieldName, fieldNum, searchF;
	if (opt != "2") {
		fieldName = document.getElementById('fieldName'+tableRef).value;
	} else {
		fieldName = document.getElementById('fieldName2'+tableRef).value;
	}
	fieldNum = fieldName.search('\u00A5');
	searchF = fieldName.indexOf("\u00A5") + 1;
	fieldNum = fieldName.substr(0, fieldNum);
	document.getElementById('fieldType'+tableRef).options.selectedIndex = parseInt(fieldNum, 10);
	fieldNameA.push(fieldName);
	rLen = fieldNameA.length;
	iLen = rLen - 1;
	
	document.getElementById('colNameSpan'+tableRef).innerHTML = fieldNameA[iLen].substr(searchF) + " is";
	document.getElementById('fieldVal'+tableRef).value = "";
	document.getElementById('fieldVal2'+tableRef).value = "";
	
}

/*function multiSearch(table, tableRef) {
    var TDtext, i;
	rLen = fieldNameA.length;
	iLen = rLen - 1;
	
	if (document.getElementById('fieldVal'+tableRef).value == "") {
		alert("Please Provide at Least One Search Criteria");
		return;
	}
	
	for (i=0;i<opA.length;i++){
		var elementStr = opA[i]+tableRef;
		if (document.getElementById(elementStr).checked==true){
			fieldOpA.push(opA[i]);
		}
	}
	
	switch (fieldOpA[iLen]){
		case 'BETWEEN':

			fieldValA.push(document.getElementById('fieldVal'+tableRef).value);
			fieldTA.push(document.getElementById('fieldType'+tableRef).value);
				
			if (iLen == 0) {
				//This is the first run
				preA.push("");
				preB.push("(");
				fieldOpA[iLen] = "Greater`than`or`equal";
				postA.push("");
				postB.push("");
				
				linkOpA.push("AND");
				
				fieldNameA.push(fieldNameA[iLen]);
				fieldValA.push(document.getElementById('fieldVal2'+tableRef).value);
				fieldTA.push(fieldTA[iLen]);
				rLen = fieldNameA.length;
				iLen = rLen - 1;
				
				preA.push("");
				preB.push("");
				fieldOpA[iLen] = "Less`than`or`equal";
				postA.push(")");
				postB.push("");
				
				linkOpA.push("");
			} else {
				//This is not the first run, we assume we are using an AND clause at this point and provide a later option allowing them to change this manually
				linkOpA[iLen - 1] = "AND";
				
				preA.push("");
				preB.push("(");
				fieldOpA[iLen] = "Greater`than`or`equal";
				postA.push("");
				postB.push("");
				
				linkOpA.push("AND");
				
				fieldNameA.push(fieldNameA[iLen]);
				fieldValA.push(document.getElementById('fieldVal2'+tableRef).value);
				fieldTA.push(fieldTA[iLen]);
				rLen = fieldNameA.length;
				iLen = rLen - 1;
				
				preA.push("");
				preB.push("");
				fieldOpA[iLen] = "Less`than`or`equal";
				postA.push(")");
				postB.push("");
				
				linkOpA.push("");
			}
		break;
		
		default:

			fieldOpA[iLen] = fieldOpA[iLen].replace(/ /g, '`'); //We are removing the spaces to help with compatibility
			fieldValA.push(document.getElementById('fieldVal'+tableRef).value);
			fieldTA.push(document.getElementById('fieldType'+tableRef).value);
			
			if (iLen == 0) {
				//This is the first run
				preA.push("");
				preB.push("");
				postA.push("");
				postB.push("");
				linkOpA.push("");
			} else {
				//This is not the first run, we assume we are using an AND clause at this point and provide a later option allowing them to change this manually
				linkOpA[iLen - 1] = "AND";
				
				preA.push("");
				preB.push("");
				postA.push("");
				postB.push("");
				linkOpA.push("");
			}
		break;
	}
	searchTranslator(table);
	document.getElementById('filterStrSpan'+tableRef).innerHTML = filterUserString;
 }*/
 
function searchTranslator(table,layerFilter, gid, functionS){
	var SuccessS;
	//OK so we are now using standard OpenLayers functions to convert between a WFS filter and a WMS filter
	//but we need to be able to convert this into an SQL string for the attributes table
	
	//The format is:
	//SELECT ? FROM table WHERE converted filter
	
	//First we reset the variable and then get the current WFS filter as our starting point (OGC)
	filterSQLString = "";
	var currentF = layerFilter;
	
	//OK next we determine if this a simple or complex filter
	if (typeof currentF == 'undefined'){	
		SuccessS = 'Null'; //No filter
	} else if (typeof currentF.filters == 'undefined'){
		//This is a simple filter but is it a blank?
		if (currentF.property == ''){
			//It is blank, we do nothing which will leave the table unfiltered
			SuccessS = 'Null';
		} else {
			//OK we do have a single filter here, lets convert it to SQL
			
			//We only record the WHERE statement so: ..
			filterSQLString = currentF.property;
			//Convert the operator to SQL compatible operator
			if (currentF.type=='=='){
				filterSQLString += ' = ';
			} else if (currentF.type=='!='){
				filterSQLString += ' <> ';
			} else if (currentF.type=='>='){
				filterSQLString += ' >= ';
			} else if (currentF.type=='<='){
				filterSQLString += ' <= ';
			} else if (currentF.type=='>'){
				filterSQLString += ' > ';
			} else if (currentF.type=='<'){
				filterSQLString += ' < ';
			} else if (currentF.type=='~'){
				filterSQLString += ' like ';
			} else if (currentF.type=='..'){
				filterSQLString += ' between ';
			}	
			//Add the value or values but do we include quotes?
			//If the field type is varchar, text, bpchar or if this is a like statement the answer is yes
			//However to avoid error checking at this point lets just check for numeric values
			if (currentF.type=='..'){
				//lowerBounds
				if (isNaN(currentF.lowerBoundary) == true){
					filterSQLString += "'" + currentF.lowerBoundary.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.lowerBoundary.replace(/ /g, "`");
				}
				filterSQLString += " ";
				//upperBounds
				if (isNaN(currentF.upperBoundary) == true){
					filterSQLString += "'" + currentF.upperBoundary.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.upperBoundary.replace(/ /g, "`");
				}
			} else {
				if (isNaN(currentF.value) == true){
					filterSQLString += "'" + currentF.value.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.value.replace(/ /g, "`");
				}
			}
			SuccessS = 'Single';
		}
	} else {
		//This is a complex filter
		var tmpFltT = currentF.type;
		if (tmpFltT=="&&"){
			tmpFltT = " and ";
		} else if (tmpFltT=="!") {
			tmpFltT = " not ";
		} else {
			tmpFltT = " or ";
		}
		filterSQLString = "";
		for (i=0;i<currentF.filters.length;i++){
			if (i!=0) {
				filterSQLString += tmpFltT;
			}
			filterSQLString += currentF.filters[i].property;
			//Convert the operator to SQL compatible operator
			if (currentF.filters[i].type=='=='){
				filterSQLString += ' = ';
			} else if (currentF.filters[i].type=='!='){
				filterSQLString += ' <> ';
			} else if (currentF.filters[i].type=='>='){
				filterSQLString += ' >= ';
			} else if (currentF.filters[i].type=='<='){
				filterSQLString += ' <= ';
			} else if (currentF.filters[i].type=='>'){
				filterSQLString += ' > ';
			} else if (currentF.filters[i].type=='<'){
				filterSQLString += ' < ';
			} else if (currentF.filters[i].type=='~'){
				filterSQLString += ' like ';
			} else if (currentF.filters[i].type=='..'){
				filterSQLString += ' between ';
			}	
			//Add the value or values but do we include quotes?
			//If isNaN is true then it should have quotes
			if (currentF.filters[i].type=='..'){
				//lowerBounds
				if (isNaN(currentF.filters[i].lowerBoundary) == true){
					filterSQLString += "'" + currentF.filters[i].lowerBoundary.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.filters[i].lowerBoundary.replace(/ /g, "`");
				}
				filterSQLString += " ";
				//upperBounds
				if (isNaN(currentF.filters[i].upperBoundary) == true){
					filterSQLString += "'" + currentF.filters[i].upperBoundary.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.filters[i].upperBoundary.replace(/ /g, "`");
				}
			} else {
				if (isNaN(currentF.filters[i].value) == true){
					filterSQLString += "'" + currentF.filters[i].value.replace(/ /g, "`") + "'";
				} else {
					filterSQLString += currentF.filters[i].value.replace(/ /g, "`");
				}
			}
		}
		SuccessS = 'Multi';
	}
	//Record the filter 
	//filterURLString = "1\u00A5" + filterSQLString; //Removing this scripting, not used!
	filterURLString = filterSQLString;
	filterURLString = filterURLString.replace(/ /g, "\u00A5");
	filterURLString = filterURLString.replace(/'/g, ""); //No quotes in the URL string
	filterURLString = filterURLString.replace(/`/g, " "); //Remove the temporary values and restore the spaces in values
	filterSQLString = filterSQLString.replace(/`/g, " "); //Remove the temporary values and restore the spaces in values
	filterURLString = filterURLString.replace("=", "Equal");
	filterURLString = filterURLString.replace("<>", "Not`equal");
	filterURLString = filterURLString.replace(">=", "Greater`than`or`equal");
	filterURLString = filterURLString.replace("<=", "Less`than`or`equal");
	filterURLString = filterURLString.replace(">", "Greater`than");
	filterURLString = filterURLString.replace("<", "Less`than");
	filterURLString = filterURLString.replace("like", "LIKE");
	filterURLString = filterURLString.replace("between", "BETWEEN");
	//alert(filterURLString);
		
	if (SuccessS == 'Null'){
		document.getElementById('filterS').value = '';
	} else {
		document.getElementById('filterS').value = filterURLString;
	}
	//Do we need to update the attributes table now?
	if (tableport.collapsed == false){
		recNo = document.getElementById('recnoS').value;
		lower = document.getElementById('lowerS').value;
		filter = document.getElementById('filterS').value;
		if (typeof functionS == 'undefined'){
			functionT = document.getElementById('functionS').value;
		} else {
			functionT = functionS;
		} 
		if (typeof gid == 'undefined'){
			gid = '';
		} else {
			gid = '&gid=' + gid;
		}
		
		if (filter.length == 0){
			tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=" + functionT + gid + "&recNo=" + recNo + "&lower=" + lower;
		} else {
			tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=" + functionT + gid + "&recNo=" + recNo + "&lower=" + lower + "&filter=" + filter;
		}
		updateTable(tableHTML, 'override');
	}
}

function removeFilter(table, tableRef) {
	document.getElementById('filterS').value = "";
	document.getElementById('lower2S').value = 0; //reset the filter lower
	var tmpFl = new OpenLayers.Filter.Comparison({type:'', property:'', value:''});
	remFilter("Table", "Table", table);
}

function deleteQrow(i, table) {
	fieldNameA.splice(i,1);
	fieldOpA.splice(i,1);
	fieldValA.splice(i,1);
	linkOpA.splice(i,1);
	searchTranslator(table);
	for (i=0;i<tableArray.length;i++){
		if(table == tableArray[i]){
			var tableRef = i;
		}
	}
	document.getElementById('filterStrSpan'+tableRef).innerHTML = filterUserString;
}

function return2Map(dir, table) {
	
	if (dir == "expand") {
		tableport.expand();
	} else {
		mapPanel.expand();
	}
}

//Map Filter Tools
var oloverlayName = [];
var olwfsName = [];
var olTitle = [];
var oloverlayAddress = [];
var tableFilters = [];
for (i=0;i<tableArray.length;i++){
	//Need to create one filter per table here
	tableFilters.push([]);
}
function filterSetup(selOpt, tmpTbn, tmpFlt) { 
	//Pevent error by not firing if 'Please select a layer' is active
	var TL, FL, objString, dupVal;
	if(selOpt!=1){
		oloverlayName = [];
		olwfsName = [];
		olTitle = [];
		oloverlayAddress = [];
		var overlayName = '';
		var wfsName = '';
		var oTitle = '';
		var olNumber = [];
		var currentFL = [];
		oloverlayName = [];
		olwfsName = [];
		olTitle = [];
		var tableNo, currentFilter;
		//OK, first question, is this a whole table filter which may apply to multiple layers?
		if (selOpt.substr(0,3)=="~T~"){
			//What layer is this
			selOpt = selOpt.substr(3,selOpt.length);
			for (i=0;i<overlayArray.length;i++){
				if(overlayTable[i]==selOpt){
					oloverlayName.push(overlayArray[i]);
					olwfsName.push(wfsArray[i]);
					olTitle.push(overlayTitle[i]);
					oloverlayAddress.push(overlayAddress[i]);
					olNumber.push(i);
				}
			}
			//We will use the first one to set up the fieldnames as all layers from one table are the same
			for (i=0;i<tableArray.length;i++){
				//We need to ensure this is stored against the correct table
				if (overlayTable[olNumber[0]]==tableArray[i]){
					tableFilters[i] = window[wfsArray[olNumber[0]]].filter;
					tableNo = i;
				}
			}
			overlayName = 'Table';
			wfsName = 'Table';
			oTitle = selOpt;
		} else {
			//What layer is this
			for (i=0;i<overlayArray.length;i++){
				if(overlayAddress[i]==selOpt){
					oloverlayName.push(overlayArray[i]);
					olwfsName.push(wfsArray[i]);
					olTitle.push(overlayTitle[i]);
					oloverlayAddress.push(overlayAddress[i]);
					olNumber.push(i);
				}
			}
			//We will use the first one to set up the fieldnames as all layers from one table are the same
			overlayName = overlayArray[olNumber[0]];
			wfsName = wfsArray[olNumber[0]];
			oTitle = overlayTitle[olNumber[0]];
		}
		//We now have three arrays which either contain one or multiple entries
		i = olNumber[0];
		if (overlayType[i]=='Postgis'){
			for (TL=0;TL<tableArray.length;TL++){
				if (tableArray[TL]==overlayTable[i]){
					for (FL=0;FL<fieldRange.length;FL++){
						if (fieldRange[FL]==TL){
							currentFL.push(fieldNamesMaster[FL]);
						}
					}
				}
			}
		} else {		
			if (wfsFields[i].length ==0){
				//In this case we need to get the field list from the corresponding wfs layer
				wfsURL = Dpath + wfsPath[i] + '?service=wfs&request=describeFeatureType&outputFormatt=application/json&typename=' + overlayAddress[i];
				$.ajax({
					url:wfsURL,
					success: function(data){
						if (typeof window.XMLSerializer != "undefined") {
							objString = (new window.XMLSerializer()).serializeToString(data);
						} else {
							objString = data.xml;
						}
						objString = objString.split("=");
						for (i2=0;i2<objString.length;i2++){
							if (objString[i2].indexOf("nillable")!= -1){
								//The first part should be a field name
								objString[i2] = objString[i2].replace(/\\/g, '');
								objString[i2] = objString[i2].replace(/"/g, '');
								objString[i2] = objString[i2].replace(' nillable', '');
								dupVal =0;
								for (i3=0;i3<wfsFields[i].length;i3++){
									if (objString[i2]==wfsFields[i][i3]){
										dupVal = 1
									}
								}
								if (dupVal==0){
									//New fieldname
									wfsFields[i].push(objString[i2]);
								}
							}
						}
					},
					async: false
				});
			}
			//OK now we pickup the fieldnames
			for (i2=0;i2<wfsFields[i].length;i2++){
				currentFL.push(wfsFields[i][i2]);
			}
		}
				
		var filterNo = [];
		var filterType = [];
		var filterType2 = [];
		var subFilter = [];
		var filterF = [];
		var filterOp = [];
		var filterVal = [];
		var filterVal2 = [];
		var tmpLen, tmpLen2, tmpLen3, tmpStr;
		var filterStr = 'No Filter';
		filterNo.push('');
		
		//Set up the filter html
		var fmhtml = "<table class='blue' width='100%'><tr><th>" + oTitle + "</th></tr>";
		fmhtml += "<tr><td><u>Current Filter:</u></td></tr>";

		var layernum;
		if (wfsName=='Table'){
			if (tableFilters[tableNo]==null){
				//No filter at present, lets make a blank one
				tableFilters[tableNo] = new OpenLayers.Filter.Comparison({
											type: '',
											property: '',
											value: ''
										});
			}
			currentFilter = tableFilters[tableNo];
		} else {
			layernum = parseInt(wfsName.replace("wfs",""));
			currentFilter = userFilters[layernum].filter;
		}
		

		//What type of filter is it?
		var fsType;
		if (typeof currentFilter.filters=='undefined'){
			if (currentFilter.property==''){
				fsType = 'None';
			} else {
				fsType = 'Single';
			}
		} else {
			fsType = 'Multiple';
		}
		
		//Process the filters (if not null)
		if (fsType != 'None'){
			//First we remove the outer brackets and the filters: text
			filterStr = currentFilter;
			var filtersStr, multiF;
			if (fsType == 'Multiple'){
				multiF = true;
				filtersStr = filterStr.filters;
			} else {
				multiF = false;
				filtersStr = filterStr;
			}
			
			//Pickup the overall type in the form of ', type:"&&"' at the end of the string
			if (multiF == true){
				//Filter with two or more conditions
				filterNo.push(''); //We now definately have another condition
				if (filterStr.type=="!"){
					filterType.push("IS NOT");
					filterType2.push("!");
				} else {
					if (filterStr.type=="&&"){
						filterType.push(" AND");
						filterType2.push("&&");
					} else {
						filterType.push(" OR");
						filterType2.push("||");
					}
				}
				
				//The actual filters are stored in the filtersStr array - *** Currently only doing two conditions ***
				var LN = 0;
				while (LN<2){
					filterOp.push(filtersStr[LN].type); 
					if (filterOp[LN]==".."){
						filterF.push(filtersStr[LN].property);
						filterVal.push(filtersStr[LN].lowerBoundary);
						filterVal2.push(filtersStr[LN].upperBoundary);
					} else {
						filterF.push(filtersStr[LN].property);
						filterVal.push(filtersStr[LN].value);
						filterVal2.push('[Please type here]');
					}
					LN = LN + 1;
				}
				var tmpFilterType, tmpFilterType2;
				if (filterOp[0]=="=="){
					tmpFilterType = " is equal to ";
				} else if (filterOp[0]=="!=") {
					tmpFilterType = " is not equal to ";
				} else if (filterOp[0]=="<") {
					tmpFilterType = " is less than ";
				} else if (filterOp[0]==">") {
					tmpFilterType = " is greater than ";
				} else if (filterOp[0]=="<=") {
					tmpFilterType = " is less than or equal to ";
				} else if (filterOp[0]==">=") {
					tmpFilterType = " is greater than or equal to ";
				} else if (filterOp[0]=="..") {
					tmpFilterType = " is between ";
				} else if (filterOp[0]=="~") {
					tmpFilterType = " is like ";
				} else if (filterOp[0]=="null") {
					tmpFilterType = " is null";
				}
				if (filterOp[1]=="=="){
					tmpFilterType2 = " is equal to ";
				} else if (filterOp[1]=="!=") {
					tmpFilterType2 = " is not equal to ";
				} else if (filterOp[1]=="<") {
					tmpFilterType2 = " is less than ";
				} else if (filterOp[1]==">") {
					tmpFilterType2 = " is greater than ";
				} else if (filterOp[1]=="<=") {
					tmpFilterType2 = " is less than or equal to ";
				} else if (filterOp[1]==">=") {
					tmpFilterType2 = " is greater than or equal to ";
				} else if (filterOp[1]=="..") {
					tmpFilterType2 = " is between ";
				} else if (filterOp[1]=="~") {
					tmpFilterType2 = " is like ";
				} else if (filterOp[1]=="null") {
					tmpFilterType2 = " is null";
				}
				if (filterType[0]=="IS NOT"){
					if (filterOp[0]==".."){
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType + filterVal[0] + ' and ' + filterVal2[0];
					} else if (filterOp[0]=="null") {
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType;
					} else {
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType + filterVal[0];
					}
					if (filterOp[1]==".."){
						filterStr += ' BUT' + '<br />' + filterF[1] + ' IS NOT ' + tmpFilterType2 + filterVal[1] + ' and ' + filterVal2[1];
					} else if (filterOp[1]=="null") {
						filterStr += ' BUT' + '<br />' + filterF[1] + ' IS NOT ' + tmpFilterType2;
					} else {
						filterStr += ' BUT' + '<br />' + filterF[1] + ' IS NOT ' + tmpFilterType2 + filterVal[1];
					}
				} else {
					if (filterOp[0]==".."){
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType + filterVal[0] + ' and ' + filterVal2[0];
					} else if (filterOp[0]=="null") {
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType;
					} else {
						filterStr = 'Where <br />' + filterF[0] + tmpFilterType + filterVal[0];
					}
					if (filterOp[1]==".."){
						filterStr += ' ' + filterType[0] + '<br />' + filterF[1] + tmpFilterType2 + filterVal[1] + ' and ' + filterVal2[1];
					} else if (filterOp[1]=="null") {
						filterStr += ' ' + filterType[0] + '<br />' + filterF[1] + tmpFilterType2;
					} else {
						filterStr += ' ' + filterType[0] + '<br />' + filterF[1] + tmpFilterType2 + filterVal[1];
					}
				}
				
			} else {
				//Simple filter
				filterOp.push(filtersStr.type);
				if (filterOp[0]==".."){
					filterF.push(filtersStr.property);
					filterVal.push(filtersStr.lowerBoundary);
					filterVal2.push(filtersStr.upperBoundary);
				} else {
					filterF.push(filtersStr.property);
					filterVal.push(filtersStr.value);
					filterVal2.push('[Please type here]');
				}
				filterOp.push('1');
				filterF.push('1');
				filterVal.push('[Please type here]');
				filterVal2.push('[Please type here]');
				filterType2.push('1');
				
				var tmpFilterType;
				if (filterOp[0]=="=="){
					tmpFilterType = " is equal to ";
				} else if (filterOp[0]=="!=") {
					tmpFilterType = " is not equal to ";
				} else if (filterOp[0]=="<") {
					tmpFilterType = " is less than ";
				} else if (filterOp[0]==">") {
					tmpFilterType = " is greater than ";
				} else if (filterOp[0]=="<=") {
					tmpFilterType = " is less than or equal to ";
				} else if (filterOp[0]==">=") {
					tmpFilterType = " is greater than or equal to ";
				} else if (filterOp[0]=="..") {
					tmpFilterType = " is between ";
				} else if (filterOp[0]=="~") {
					tmpFilterType = " is like ";
				} else if (filterOp[0]=="null") {
					tmpFilterType = " is null";
				}
				
				if (filterOp[0]==".."){
					filterStr = 'Where <br /><i>' + filterF[0] + '</i>' + tmpFilterType + '<i>'+ filterVal[0] + '</i> and <i>' + filterVal2[0] + '</i>';
				} else if (filterOp[0]=="null") {
					filterStr = 'Where <br /><i>' + filterF[0] + '</i>' + tmpFilterType;
				} else {
					filterStr = 'Where <br /><i>' + filterF[0] + '</i>' + tmpFilterType + '<i>' + filterVal[0] + '</i>';
				}
				
			}	
			
			var fmhtml2 = '';
			for (i=0;i<currentFL.length;i++){
				if (filterF[0]==currentFL[i]) {
					fmhtml2 += "<option value='" + currentFL[i] + "' selected='selected'>" + currentFL[i] + "</option>";
				} else {
					fmhtml2 += "<option value='" + currentFL[i] + "'>" + currentFL[i] + "</option>";
				}
			}
			
			fmhtml += "<tr><td>" + filterStr + " </td></tr>";
			fmhtml += "<tr><th>Update Filter</th></tr>";
			fmhtml += "<tr><td><u>Condition 1</u></td></tr>";
			if (filterF[0]=='1') {
				fmhtml += "<tr><td>Field: <select id='fm2' name='fm2' style='width: 170px'><option value='1' selected='selected'>Which Column?</option>";
			} else {
				fmhtml += "<tr><td>Field: <select id='fm2' name='fm2' style='width: 170px'><option value='1'>Which Column?</option>";
			}
			fmhtml += fmhtml2;
			fmhtml += "</select><br />";
			if (filterOp[0]=='1'){
				fmhtml += "<select id='fm3' name='fm3' style='width: 204px' onchange='betweenFix(this.value, 1)'><option value='1' selected='selected'>Operator?</option>";
			} else {
				fmhtml += "<select id='fm3' name='fm3' style='width: 204px' onchange='betweenFix(this.value, 1)'><option value='1'>Operator?</option>";
			}
			if (filterOp[0]=='=='){
				fmhtml += "<option value='==' selected='selected'>Equal to</option>";
			} else {
				fmhtml += "<option value='=='>Equal to</option>";
			}
			if (filterOp[0]=='!='){
				fmhtml += "<option value='!=' selected='selected'>No equal to</option>";
			} else {
				fmhtml += "<option value='!='>No equal to</option>";
			}
			if (filterOp[0]=='<'){
				fmhtml += "<option value='<' selected='selected'>Less than</option>";
			} else {
				fmhtml += "<option value='<'>Less than</option>";
			}
			if (filterOp[0]=='>'){
				fmhtml += "<option value='>' selected='selected'>Greater than</option>";
			} else {
				fmhtml += "<option value='>'>Greater than</option>";
			}
			if (filterOp[0]=='<='){
				fmhtml += "<option value='<=' selected='selected'>Less than or equal to</option>";
			} else {
				fmhtml += "<option value='<='>Less than or equal to</option>";
			}
			if (filterOp[0]=='>='){
				fmhtml += "<option value='>=' selected='selected'>Greater than or equal to</option>";
			} else {
				fmhtml += "<option value='>='>Greater than or equal to</option>";
			}
			if (filterOp[0]=='..'){
				fmhtml += "<option value='..' selected='selected'>Between</option>";
			} else {
				fmhtml += "<option value='..'>Between</option>";
			}
			if (filterOp[0]=='~'){
				fmhtml += "<option value='~' selected='selected'>Like</option>";
			} else {
				fmhtml += "<option value='~'>Like</option>";
			}
			//if (filterOp[0]=='null'){
			//	fmhtml += "<option value='null' selected='selected'>IS NULL</option>";
			//} else {
			//	fmhtml += "<option value='null'>IS NULL</option>";
			//}
			fmhtml += "</select><br />";
			fmhtml += "Value1: <input type='text' id='fm4a' name='fm4a' style='width: 202px' onclick='clearVal(\"fm4a\")' value='" + filterVal[0] + "' /><br />";
			if (filterOp[0]=='..'){
				fmhtml += "Value2: <input type='text' id='fm4b' name='fm4b' style='width: 202px' onclick='clearVal(\"fm4b\")' value='" + filterVal2[0] + "' /></td></tr>";
			} else {
				fmhtml += "Value2: <input type='text' disabled='disabled' id='fm4b' name='fm4b' style='width: 202px' value='" + filterVal2[0] + "' /></td></tr>";
			}
			fmhtml += "<tr><td><u>Condition 2</u></td></tr>";
			var fmhtml2 = '';
			for (i=0;i<currentFL.length;i++){
				if (filterF[1]==currentFL[i]) {
					fmhtml2 += "<option value='" + currentFL[i] + "' selected='selected'>" + currentFL[i] + "</option>";
				} else {
					fmhtml2 += "<option value='" + currentFL[i] + "'>" + currentFL[i] + "</option>";
				}
			}
			if (filterF[1]=='1') {
				fmhtml += "<tr><td>Field: <select id='fm5' name='fm5' style='width: 170px'><option value='1' selected='selected'>Which Column?</option><option value='2'>Not Required</option>";
			} else if (filterF[1]=='2') {
				fmhtml += "<tr><td>Field: <select id='fm5' name='fm5' style='width: 170px'><option value='1'>Which Column?</option><option value='2' selected='selected'>Not Required</option>";
			} else {
				fmhtml += "<tr><td>Field: <select id='fm5' name='fm5' style='width: 170px'><option value='1'>Which Column?</option><option value='2'>Not Required</option>";
			}
			fmhtml += fmhtml2;
			fmhtml += "</select><br />";
			if (filterOp[1]=='1'){
				fmhtml += "<select id='fm6' name='fm6' style='width: 204px' onchange='betweenFix(this.value, 2)'><option value='1' selected='selected'>Operator?</option>";
			} else {
				fmhtml += "<select id='fm6' name='fm6' style='width: 204px' onchange='betweenFix(this.value, 2)'><option value='1'>Operator?</option>";
			}
			if (filterOp[1]=='=='){
				fmhtml += "<option value='==' selected='selected'>Equal to</option>";
			} else {
				fmhtml += "<option value='=='>Equal to</option>";
			}
			if (filterOp[1]=='!='){
				fmhtml += "<option value='!=' selected='selected'>No equal to</option>";
			} else {
				fmhtml += "<option value='!='>No equal to</option>";
			}
			if (filterOp[1]=='<'){
				fmhtml += "<option value='<' selected='selected'>Less than</option>";
			} else {
				fmhtml += "<option value='<'>Less than</option>";
			}
			if (filterOp[1]=='>'){
				fmhtml += "<option value='>' selected='selected'>Greater than</option>";
			} else {
				fmhtml += "<option value='>'>Greater than</option>";
			}
			if (filterOp[1]=='<='){
				fmhtml += "<option value='<=' selected='selected'>Less than or equal to</option>";
			} else {
				fmhtml += "<option value='<='>Less than or equal to</option>";
			}
			if (filterOp[1]=='>='){
				fmhtml += "<option value='>=' selected='selected'>Greater than or equal to</option>";
			} else {
				fmhtml += "<option value='>='>Greater than or equal to</option>";
			}
			if (filterOp[1]=='..'){
				fmhtml += "<option value='..' selected='selected'>Between</option>";
			} else {
				fmhtml += "<option value='..'>Between</option>";
			}
			if (filterOp[1]=='~'){
				fmhtml += "<option value='~' selected='selected'>Like</option>";
			} else {
				fmhtml += "<option value='~'>Like</option>";
			}
			//if (filterOp[1]=='null'){
			//	fmhtml += "<option value='null' selected='selected'>IS NULL</option>";
			//} else {
			//	fmhtml += "<option value='null'>IS NULL</option>";
			//}
			fmhtml += "</select><br />";
			fmhtml += "Value1: <input type='text' id='fm7a' name='fm7a' style='width: 202px' onclick='clearVal(\"fm7a\")' value='" + filterVal[1] + "' /><br />";
			if (filterOp[1]=='..'){
				fmhtml += "Value2: <input type='text' id='fm7b' name='fm7b' style='width: 202px' onclick='clearVal(\"fm7b\")' value='" + filterVal2[1] + "' /></td></tr>";
			} else {
				fmhtml += "Value2: <input type='text' disabled='disabled' id='fm7b' name='fm7b' style='width: 202px' value='" + filterVal2[1] + "' /></td></tr>";
			}
			fmhtml += "<tr><td><u>Relationship</u></td></tr>";
			if (filterType2[0]=="1"){
				fmhtml += "<tr><td><select id='fm8' name='fm8' style='width: 204px'><option selected='selected' value='1'>Please Select</option>";
			} else {	
				fmhtml += "<tr><td><select id='fm8' name='fm8' style='width: 204px'><option value='1'>Please Select</option>";
			}
			if (filterType2[0]=="&&"){
				fmhtml += "<option value='&&' selected='selected'>Match both conditions</option>";
			} else {
				fmhtml += "<option value='&&'>Match both conditions</option>";
			}
			if (filterType2[0]=="||"){
				fmhtml += "<option value='||' selected='selected'>Match either condition</option>";
			} else {
				fmhtml += "<option value='||'>Match either condition</option>";
			}
			if (filterType2[0]=="!"){
				fmhtml += "<option value='!' selected='selected'>Match the first but NOT second</option>";
			} else {
				fmhtml += "<option value='!'>Match the first but NOT second</option>";
			}
			fmhtml += "</select></td></tr>";
			fmhtml += "<tr><th><input type='button' onclick='updateFilterForm(\""+wfsName+"\", \""+overlayName+"\", \""+selOpt+"\")' value='Update Filter' />&nbsp;&nbsp;&nbsp;&nbsp;<input type='button' onclick='remFilter(\""+wfsName+"\", \""+overlayName+"\", \""+selOpt+"\")' value='Remove Filter' /></th></tr>";
			
		} else {
			var fmhtml2 = '';
			for (i=0;i<currentFL.length;i++){
				fmhtml2 += "<option value='" + currentFL[i] + "'>" + currentFL[i] + "</option>";
			}
			
			fmhtml += "<tr><td>" + filterStr + " </td></tr>";
			fmhtml += "<tr><th>Update Filter</th></tr>";
			fmhtml += "<tr><td><u>Condition 1</u></td></tr>";
			fmhtml += "<tr><td>Field: <select id='fm2' name='fm2' style='width: 170px'><option selected='selected' value='1'>Which Column?</option>";
			fmhtml += fmhtml2;
			fmhtml += "</select><br />";
			fmhtml += "<select id='fm3' name='fm3' style='width: 204px' onchange='betweenFix(this.value, 1)'><option selected='selected' value='1'>Operator?</option>";
			fmhtml += "<option value='=='>Equal to</option>";
			fmhtml += "<option value='!='>No equal to</option>";
			fmhtml += "<option value='<'>Less than</option>";
			fmhtml += "<option value='>'>Greater than</option>";
			fmhtml += "<option value='<='>Less than or equal to</option>";
			fmhtml += "<option value='>='>Greater than or equal to</option>";
			fmhtml += "<option value='..'>Between</option>";
			fmhtml += "<option value='~'>Like</option>";
			//fmhtml += "<option value='null'>IS NULL</option>";
			fmhtml += "</select><br />";
			fmhtml += "Value1: <input type='text' id='fm4a' name='fm4a' style='width: 202px' onclick='clearVal(\"fm4a\")' value='[Please type here]' /><br />";
			fmhtml += "Value2: <input type='text' disabled='disabled' id='fm4b' name='fm4b' style='width: 202px' onclick='clearVal(\"fm4b\")' value='[Please type here]' /></td></tr>";
			fmhtml += "<tr><td><u>Condition 2</u></td></tr>";
			fmhtml += "<tr><td>Field: <select id='fm5' name='fm5' style='width: 170px'><option selected='selected' value='1'>Which Column?</option><option value='2'>Not Required</option>";
			fmhtml += fmhtml2;
			fmhtml += "</select><br />";
			fmhtml += "<select id='fm6' name='fm6' style='width: 202px' onchange='betweenFix(this.value, 2)'><option selected='selected' value='1'>Operator?</option>";
			fmhtml += "<option value='=='>Equal to</option>";
			fmhtml += "<option value='!='>No equal to</option>";
			fmhtml += "<option value='<'>Less than</option>";
			fmhtml += "<option value='>'>Greater than</option>";
			fmhtml += "<option value='<='>Less than or equal to</option>";
			fmhtml += "<option value='>='>Greater than or equal to</option>";
			fmhtml += "<option value='..'>Between</option>";
			fmhtml += "<option value='~'>Like</option>";
			//fmhtml += "<option value='null'>IS NULL</option>";
			fmhtml += "</select><br />";
			fmhtml += "Value1: <input type='text' id='fm7a' name='fm7a' style='width: 202px' onclick='clearVal(\"fm7a\")' value='[Please type here]' /><br />";
			fmhtml += "Value2: <input type='text' disabled='disabled' id='fm7b' name='fm7b' style='width: 202px' onclick='clearVal(\"fm7b\")' value='[Please type here]' /></td></tr>";
			fmhtml += "<tr><td><u>Relationship</u></td></tr>";
			fmhtml += "<tr><td><select id='fm8' name='fm8' style='width: 204px'><option selected='selected' value='1'>Please Select Conditions</option>";
			fmhtml += "<option value='&&'>Match both conditions</option>";
			fmhtml += "<option value='||'>Match either condition</option>";
			fmhtml += "<option value='!'>Match the first but NOT second</option>";
			fmhtml += "</select></td></tr>";
			fmhtml += "<tr><th><input type='button' onclick='updateFilterForm(\""+wfsName+"\", \""+overlayName+"\", \""+selOpt+"\")' value='Update Filter' /></th></tr>";
			
		}
		fmhtml += "</table>";

		//Send the html to the panel
		document.getElementById('filterDiv').innerHTML = fmhtml;
		if (typeof tmpTbn != 'undefined'){
			betweenFix('', '', tmpTbn, tmpFlt);
		} else {
			betweenFix('', '');
		}
	}
}

function clearVal(element){
	if (document.getElementById(element).value == '[Please type here]'){
		document.getElementById(element).value = '';
	}
}

function betweenFix(optVal, selectID, tmpTbn, tmpFlt) {
	var passfail = 'OK';
	if (optVal!=''){
		//Switch disabled
		if (optVal=='..'){
			if (selectID==1){
				document.getElementById('fm4b').disabled = '';
			} else {
				document.getElementById('fm7b').disabled = '';
			}
		} else {
			if (selectID==1){
				document.getElementById('fm4b').disabled = 'disabled';
			} else {
				document.getElementById('fm7b').disabled = 'disabled';
			}
		}
	}
	
	//Calls with no further variables provided will colour the inputs
	if (document.getElementById('fm8').value == '1'){
		//Just the one option required
		document.getElementById('fm5').style.backgroundColor = '#F5DEB3'; //Orange
		document.getElementById('fm6').style.backgroundColor = '#F5DEB3'; //Orange
		document.getElementById('fm7a').style.backgroundColor = '#F5DEB3'; //Orange
		if (document.getElementById('fm7b').disabled == false){
			document.getElementById('fm7b').style.backgroundColor = '#F5DEB3'; //Orange
		}
		if (document.getElementById('fm2').value==1){
			document.getElementById('fm2').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm2').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm3').value==1){
			document.getElementById('fm3').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm3').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm4a').value=='' || document.getElementById('fm4a').value=='[Please type here]'){
			document.getElementById('fm4a').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm4a').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm4b').disabled == false){
			if (document.getElementById('fm4b').value=='' || document.getElementById('fm4b').value=='[Please type here]'){
				document.getElementById('fm4b').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm4b').style.backgroundColor = '#98FB98'; //Green
			}
		}
		if (document.getElementById('fm5').value!=1 || document.getElementById('fm6').value!=1 || (document.getElementById('fm7a').value!='' && document.getElementById('fm7a').value!='[Please type here]') || (document.getElementById('fm7b').value!='' && document.getElementById('fm7b').value!='[Please type here]')){
			if (document.getElementById('fm8').value == '1'){
				document.getElementById('fm8').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm8').style.backgroundColor = '#F5DEB3'; //Orange
			}
		} else {
			document.getElementById('fm8').style.backgroundColor = '#F5DEB3'; //Orange
		}
	} else {
		document.getElementById('fm8').style.backgroundColor = '#98FB98'; //Green
		if (document.getElementById('fm2').value==1){
			document.getElementById('fm2').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm2').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm3').value==1){
			document.getElementById('fm3').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm3').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm4a').value=='' || document.getElementById('fm4a').value=='[Please type here]'){
			document.getElementById('fm4a').style.backgroundColor = '#FA8072'; //Red
			passfail = 'Fail';
		} else {
			document.getElementById('fm4a').style.backgroundColor = '#98FB98'; //Green
		}
		if (document.getElementById('fm4b').disabled == false){
			if (document.getElementById('fm4b').value=='' || document.getElementById('fm4b').value=='[Please type here]'){
				document.getElementById('fm4b').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm4b').style.backgroundColor = '#98FB98'; //Green
			}
		}
		if (document.getElementById('fm5').value==2){
			document.getElementById('fm5').style.backgroundColor = '#F5DEB3'; //Orange
			document.getElementById('fm6').style.backgroundColor = '#F5DEB3'; //Orange
			document.getElementById('fm7a').style.backgroundColor = '#F5DEB3'; //Orange
			if (document.getElementById('fm7b').disabled == false){
				document.getElementById('fm7b').style.backgroundColor = '#F5DEB3'; //Orange
			}
		} else {
			if (document.getElementById('fm5').value==1){
				document.getElementById('fm5').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm5').style.backgroundColor = '#98FB98'; //Green
			}
			if (document.getElementById('fm6').value==1){
				document.getElementById('fm6').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm6').style.backgroundColor = '#98FB98'; //Green
			}
			if (document.getElementById('fm7a').value=='' || document.getElementById('fm7a').value=='[Please type here]'){
				document.getElementById('fm7a').style.backgroundColor = '#FA8072'; //Red
				passfail = 'Fail';
			} else {
				document.getElementById('fm7a').style.backgroundColor = '#98FB98'; //Green
			}
			if (document.getElementById('fm7b').disabled == false){
				if (document.getElementById('fm7b').value=='' || document.getElementById('fm7b').value=='[Please type here]'){
					document.getElementById('fm7b').style.backgroundColor = '#FA8072'; //Red
					passfail = 'Fail';
				} else {
					document.getElementById('fm7b').style.backgroundColor = '#98FB98'; //Green
				}
			}
		}
	}
	if (typeof tmpTbn != 'undefined' && passfail == 'OK'){
		//Run the table update
		searchTranslator(tmpTbn, tmpFlt);
	}
}

// use a CQL parser for easy filter creation
var CQLformat = new OpenLayers.Format.CQL();
var tableLoopName, tmpFlt, tmpTbn;
function updateFilterForm(wfsName, overlayName, selOpt, loopback){
	if (typeof loopback == 'undefined'){
		//If it is undefined then this is the first loop
		loopback = 0;
		if (oloverlayName.length>1){
			tableLoopName = selOpt;
			tmpTbn = selOpt;
		} else {
			tableLoopName = oloverlayAddress[0];
			for (i=0;i<overlayTable.length;i++){
				if (overlayAddress[i]==oloverlayAddress[0]){
					tmpTbn = overlayTable[i];
				}
			}
		}
	}
	//If we have multiple filters we will loop back otherwise it will not loop back
	if (loopback<oloverlayName.length){
		updateFilterForm2(olwfsName[loopback], oloverlayName[loopback], olTitle[loopback],loopback);
	} else {
		//This is the end of the looping we re-run the filterSetup here
		if (olwfsName.length>1){
			for (i=0;i<tableArray.length;i++){
				//We need to ensure this is stored against the correct table
				if (tableLoopName==tableArray[i]){
					tableFilters[i] = window[olwfsName[loopback-1]].filter;
					tmpFlt = window[olwfsName[loopback-1]].filter;
				}
			}
			filterSetup("~T~" + tableLoopName, tmpTbn, tmpFlt);
		} else {
			//Pickup the table name and layer filter then run the searchTranslator
			tmpFlt = window[olwfsName[loopback-1]].filter;
			filterSetup(tableLoopName, tmpTbn, tmpFlt);
		}
	}
}

function updateFilterForm2(wfsName, overlayName, selOpt, loopback){
	//Validate the form
	betweenFix('');
	var fm2, fm3, fm4a, fm4b, fm5, fm6, fm7a, fm7b, fm8;
	var filterStr = '';
	if (selOpt!=1){
		//Get the values
		fm2 = document.getElementById('fm2').value;
		fm3 = document.getElementById('fm3').value;
		fm4a = document.getElementById('fm4a').value;
		fm4b = document.getElementById('fm4b').value;
		fm5 = document.getElementById('fm5').value;
		fm6 = document.getElementById('fm6').value;
		fm7a = document.getElementById('fm7a').value;
		fm7b = document.getElementById('fm7b').value;
		fm8 = document.getElementById('fm8').value;
		
		if (fm8!=1 && (fm5==1 || fm5==2)){
			//Error there is an operator without a second condition 
			alert("You need to provide a second condition");
		} else if ((fm5!=1 && fm5!=2) && fm8==1){
			//Error there is a second condition without an operator
			alert("You need to specify how the two conditions relate (i.e. matches both)");
		} else {
			//First test passed successfully
			if (fm8!=1){
				//Two conditions
				//Condition 1
				var condition1 = '';
				if (fm3!=1) {
					if (fm2!=1) {
						if (fm3=='..'){
							//Need two values
							if (fm4a=='[Please type here]' || fm4b=='[Please type here]' || fm4a==''|| fm4b==''){
								//Value is missing
								alert("You need to specify both search values for condition 1");
							} else {
								//Second test passed, lets create a query
								condition1 = 'OK1';
							}
						} else if (fm3=='null') {
							condition1 = 'OK3';
						} else {
							//Just one
							if (fm4a=='[Please type here]' || fm4a==''){
								//Value is missing
								alert("You need to specify the search value for condition 1");
							} else {
								//Second test passed
								condition1 = 'OK2';
							}
						}
					} else {
						//No search field
						alert("You need to provide the fieldname to filter by");
					}
				} else {
					//No operator for the condition
					alert("You need to provide the operator (i.e. is equal to)");
				}
				
				if (condition1!=''){
					if (fm6!=1) {
						if (fm5!=1) {
							if (fm6=='..'){
								//Need two values
								if (fm7a=='[Please type here]' || fm7b=='[Please type here]' || fm7a==''|| fm7b==''){
									//Value is missing
									alert("You need to specify both search values for condition 2");
								} else {
									//Second test passed, lets create a query
									if (condition1=="OK2") {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2,
													value: fm4a
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													lowerBoundary: fm7a,
													upperBoundary: fm7b
												})
											]
										});
									} else if (condition1=="OK3") {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													lowerBoundary: fm7a,
													upperBoundary: fm7b
												})
											]
										});
									} else {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2,
													lowerBoundary: fm4a,
													upperBoundary: fm4b
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													lowerBoundary: fm7a,
													upperBoundary: fm7b
												})
											]
										});
									}
								}
							} else if (fm6=='null') {
								//Second test passed, lets create a query
								if (condition1=="OK2") {
									filterStr = new OpenLayers.Filter.Logical({
										type: fm8,
										filters: [
											new OpenLayers.Filter.Comparison({
												type: fm3,
												property: fm2,
												value: fm4a
											}),
											new OpenLayers.Filter.Comparison({
												type: fm6,
												property: fm5
											})
										]
									});
								} else if (condition1=="OK3") {
									filterStr = new OpenLayers.Filter.Logical({
										type: fm8,
										filters: [
											new OpenLayers.Filter.Comparison({
												type: fm3,
												property: fm2
											}),
											new OpenLayers.Filter.Comparison({
												type: fm6,
												property: fm5
											})
										]
									});
								} else {
									filterStr = new OpenLayers.Filter.Logical({
										type: fm8,
										filters: [
											new OpenLayers.Filter.Comparison({
												type: fm3,
												property: fm2,
												lowerBoundary: fm4a,
												upperBoundary: fm4b
											}),
											new OpenLayers.Filter.Comparison({
												type: fm6,
												property: fm5
											})
										]
									});
								}
							} else {
								//Second test passed, lets create a query
								if (fm7a=='[Please type here]' || fm7a==''){
									//Value is missing
									alert("You need to specify the search value for condition 1");
								} else {
									//Second test passed
									if (condition1=="OK2") {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2,
													value: fm4a
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													value: fm7a
												})
											]
										});
									} else if (condition1=="OK3") {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													value: fm7a
												})
											]
										});
									} else {
										filterStr = new OpenLayers.Filter.Logical({
											type: fm8,
											filters: [
												new OpenLayers.Filter.Comparison({
													type: fm3,
													property: fm2,
													lowerBoundary: fm4a,
													upperBoundary: fm4b
												}),
												new OpenLayers.Filter.Comparison({
													type: fm6,
													property: fm5,
													value: fm7a
												})
											]
										});
									}
								}
							}
							if (fm3=='~') {
								//If this is a like claus we have some magic to work
								if (fm4a.indexOf("*")==-1){
									//No wildcard so assume user is unware of how to use the LIKE statement and wrap it
									fm4a = "*" + fm4a + "*";
								}
								filterStr.filters[0].value = fm4a;
								filterStr.filters[0].matchCase = false;
							} 
							if (fm6=='~') {
								//If this is a like claus we have some magic to work
								if (fm7a.indexOf("*")==-1){
									//No wildcard so assume user is unware of how to use the LIKE statement and wrap it
									fm7a = "*" + fm7a + "*";
								}
								filterStr.filters[1].value = fm7a;
								filterStr.filters[1].matchCase = false;
							} 
						} else {
							//No search field
							alert("You need to provide the fieldname to filter by");
						}
					} else {
						//No operator for the condition
						alert("You need to provide the operator (i.e. is equal to)");
					}
				} 
			} else {
				//One condition
				if (fm3!=1) {
					if (fm2!=1) {
						if (fm3=='..'){
							//Need two values
							if (fm4a=='[Please type here]' || fm4b=='[Please type here]' || fm4a==''|| fm4b==''){
								//Value is missing
								alert("You need to specify both search values for condition 1");
							} else {
								//Second test passed, lets create a query
								filterStr = new OpenLayers.Filter.Comparison({
									type: fm3,
									property: fm2,
									lowerBoundary: fm4a,
									upperBoundary: fm4b
								});
							}
						} else if (fm3=='~') {
							//If this is a like claus we have some magic to work
							if (fm4a.indexOf("*")==-1){
								//No wildcard so assume user is unware of how to use the LIKE statement and wrap it
								fm4a = "*" + fm4a + "*";
							}
							filterStr = new OpenLayers.Filter.Comparison({
								type: fm3,
								property: fm2,
								value: fm4a,
								matchCase: false
							});
						} else if (fm3=='null') {
							//IS Null
							filterStr = new OpenLayers.Filter.Comparison({
								type: fm3,
								property: fm2
							});
						} else {
							//Just one
							if (fm4a=='[Please type here]' || fm4a==''){
								//Value is missing
								alert("You need to specify the search value for condition 1");
							} else {
								//Second test passed
								filterStr = new OpenLayers.Filter.Comparison({
									type: fm3,
									property: fm2,
									value: fm4a
								});
							}
						}
					} else {
						//No search field
						alert("You need to provide the fieldname to filter by");
					}
				} else {
					//No operator for the condition
					alert("You need to provide the operator (i.e. is equal to)");
				}
			}
		}
	}
	if (filterStr!=''){
		var layerSw = overlayName; //This is the overlay to update
		var wfsSw = wfsName; //This is the corresponding WFS layer
		var layernum = parseInt(wfsName.replace("wfs",""));
		var layfilter = legendFilters[layernum].filter;
		userFilters[layernum].filter = filterStr;
		var usfilter = userFilters[layernum].filter;
		var filterParams = {
			filter: null
		};
		
		if (typeof layfilter.filters=='undefined' && layfilter.property==''){
			//No layer filter
			if (typeof usfilter.filters=='undefined' && usfilter.property==''){
				//No user filter
				window[layerSw].mergeNewParams(filterParams); //Update the WMS
				window[wfsSw].filter = null; //Update the wfs
			} else {
			//No layer filter but there is a user filter
				//Update the WMS
				try {
					filterParams.filter = xml.write(filter_1_1.write(userFilters[layernum].filter)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams); 
				
				window[wfsSw].filter = userFilters[layernum].filter; //Update the wfs
			}
		} else {
			//There is a layer filter
			if (typeof usfilter.filters=='undefined' && usfilter.property==''){
			//No user filter
				//Update the WMS
				try {
					filterParams.filter = xml.write(filter_1_1.write(legendFilters[layernum].filter)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams); 
				
				window[wfsSw].filter = legendFilters[layernum].filter; //Update the wfs
			} else {
			//Both filters apply
				//Update the WMS
				var tmpFL = new OpenLayers.Filter.Logical({
					type: '&&',
					filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
				});	
				try {
					filterParams.filter = xml.write(filter_1_1.write(tmpFL)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams);
				
				//Update the wfs
				window[wfsSw].filter = new OpenLayers.Filter.Logical({
					type: '&&',
					filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
				});	
			}
		}
		
		window[layerSw].redraw();
		window[wfsSw].refresh({force: true});
	}
	updateFilterForm(wfsSw,layerSw,selOpt,loopback+1);
}

var tableLoopName2;
function remFilter(wfsName, overlayName, selOpt, loopback){
	if (typeof loopback == 'undefined'){
		//If it is undefined then this is the first loop
		loopback = 0;
		if (oloverlayName.length>1){
			tableLoopName2 = selOpt;
			tmpTbn = selOpt;
		} else {
			tableLoopName2 = oloverlayAddress[0];
			for (i=0;i<overlayTable.length;i++){
				if (overlayAddress[i]==oloverlayAddress[0]){
					tmpTbn = overlayTable[i];
				}
			}
		}
	}
	//If we have multiple filters we will loop back otherwise it will not loop back
	if (loopback<oloverlayName.length){
		remFilter2(olwfsName[loopback], oloverlayName[loopback], olTitle[loopback],loopback);
	} else {
		//This is the end of the looping we re-run the filterSetup here
		if (olwfsName.length>1){
			for (i=0;i<tableArray.length;i++){
				//We need to ensure this is stored against the correct table
				if (tableLoopName2==tableArray[i]){
					tableFilters[i] = new OpenLayers.Filter.Comparison({
										type: '',
										property: '',
										value: ''
									});
					tmpFlt = new OpenLayers.Filter.Comparison({
								type: '',
								property: '',
								value: ''
							});
				}
			}
			filterSetup("~T~" + tableLoopName2, tmpTbn, tmpFlt);
		} else {
			//Pickup the table name and layer filter then run the searchTranslator
			tmpFlt = new OpenLayers.Filter.Comparison({
						type: '',
						property: '',
						value: ''
					});
			filterSetup(tableLoopName2, tmpTbn, tmpFlt);
		}
		searchRec(table);
	}
}

function remFilter2(wfsName, overlayName, selOpt, loopback) {
	var layerSw = overlayName; //This is the overlay to update
	var wfsSw = wfsName; //This is the corresponding WFS layer
	var layernum = parseInt(wfsName.replace("wfs",""));
	var layfilter = legendFilters[layernum].filter;
	var filterParams = {
		filter: null
	};
	
	userFilters[layernum].filter = new OpenLayers.Filter.Comparison({type: '', property:'', value:''});
	var usfilter = userFilters[layernum].filter;
	
	if (typeof layfilter.filters=='undefined' && layfilter.property==''){
		//No layer filter
		if (typeof usfilter.filters=='undefined' && usfilter.property==''){
			//No user filter
			window[layerSw].mergeNewParams(filterParams); //Update the WMS
			window[wfsSw].filter = null; //Update the wfs
		} else {
		//No layer filter but there is a user filter
			//Update the WMS
			try {
				filterParams.filter = xml.write(filter_1_1.write(userFilters[layernum].filter)); 
			} catch (err) {
				alert(err.message);
			}
			window[layerSw].mergeNewParams(filterParams); 
			
			window[wfsSw].filter = userFilters[layernum].filter; //Update the wfs
		}
	} else {
		//There is a layer filter
		if (typeof usfilter.filters=='undefined' && usfilter.property==''){
		//No user filter
			//Update the WMS
			try {
				filterParams.filter = xml.write(filter_1_1.write(legendFilters[layernum].filter)); 
			} catch (err) {
				alert(err.message);
			}
			window[layerSw].mergeNewParams(filterParams); 
			
			window[wfsSw].filter = legendFilters[layernum].filter; //Update the wfs
		} else {
		//Both filters apply
			//Update the WMS
			var tmpFL = new OpenLayers.Filter.Logical({
				type: '&&',
				filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
			});	
			try {
				filterParams.filter = xml.write(filter_1_1.write(tmpFL)); 
			} catch (err) {
				alert(err.message);
			}
			window[layerSw].mergeNewParams(filterParams);
			
			//Update the wfs
			window[wfsSw].filter = new OpenLayers.Filter.Logical({
				type: '&&',
				filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
			});	
		}
	}
	
	window[layerSw].redraw();
	window[wfsSw].refresh({force: true});
	remFilter(wfsSw,layerSw,selOpt,loopback+1);
}

function mergeNewParams(params, filterCQLString, table1){
	//Get the overlay name for refresh
	var overlayName = '';
	var wfsName = '';
	var filterStr;
	for (i=0;i<overlayArray.length;i++){
		if(overlayTable[i]==table1){
			overlayName = overlayArray[i];
			wfsName = wfsArray[i];
		}
	}
	var boundingBox, WFSfilterObj;
	var filter1, filter2, filter3, filter4, filter5, splitLen, strLen, compareType;
	filter1 = [];
	filter2 = [];
	filter3 = [];
	filter4 = [];
	filter5 = [];
	//create an object
	WFSfilter = params.filter;
	if (WFSfilter == null){
		WFSfilter = '';
	}
	if (WFSfilter!=''){
		//We need to create a WFS query using the OpenLayers.Filter.Comparison options
		//Do we have multiple queries?
		strLen = WFSfilter.length;
		if (WFSfilter.indexOf(" AND ")==-1 && WFSfilter.indexOf(" OR ")==-1){
			//This is a single query
			//Process the WFSfilter string into constituent parts
			/*OpenLayers.Filter.Comparison.EQUAL_TO = ==;
			OpenLayers.Filter.Comparison.NOT_EQUAL_TO = !=;
			OpenLayers.Filter.Comparison.LESS_THAN = <;
			OpenLayers.Filter.Comparison.GREATER_THAN = >;
			OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO = <=;
			OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = >=;
			OpenLayers.Filter.Comparison.BETWEEN = ..;  (lowerBoundary and upperBoundary) - Not currently available
			OpenLayers.Filter.Comparison.LIKE = ~;
			OpenLayers.Filter.Comparison.IS_null = null;*/
			if (WFSfilter.indexOf("==") != -1) {
				//EQUAL_TO
				splitLen = WFSfilter.indexOf("==");
				filter1.push("==");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf("<>") != -1) {
				//NOT_EQUAL_TO
				splitLen = WFSfilter.indexOf("<>");
				filter1.push("!=");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf("<=") != -1) {
				//LESS_THAN_OR_EQUAL_TO
				splitLen = WFSfilter.indexOf("<=");
				filter1.push("<=");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf(">=") != -1) {
				//GREATER_THAN_OR_EQUAL_TO
				splitLen = WFSfilter.indexOf(">=");
				filter1.push(">=");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf("<") != -1) {
				//LESS_THAN
				splitLen = WFSfilter.indexOf("<");
				filter1.push("<");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+2,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf(">") != -1) {
				//GREATER_THAN
				splitLen = WFSfilter.indexOf(">");
				filter1.push(">");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+2,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf("IS NULL") != -1) {
				//IS NULL
				splitLen = WFSfilter.indexOf("IS NULL");
				filter1.push("null");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+8,strLen).trim());
				filter4.push(0);
			} else if(WFSfilter.indexOf("LIKE") != -1) {
				//LIKE
				splitLen = WFSfilter.indexOf("LIKE");
				filter1.push("~");
				filter2.push(WFSfilter.substring(0,splitLen-1).trim());
				filter3.push(WFSfilter.substring(splitLen+5,strLen).trim());
				filter4.push(0);
			} else {
				//Error, don't apply a WFS filter
				filter4.push(-1);
			}
			
			//Create a WFS filter
			if (filter4[0]!=-1){
				WFSfilterObj = new OpenLayers.Filter.Comparison({
					type: filter1[0],
					property: filter2[0],
					value: filter3[0]
				});
			} else {
				WFSfilterObj = "ERROR";
			}
		} else {
			//We have multiple filters so we need to split it up first (assuming only two options permitted)
			if (WFSfilter.indexOf(" AND ")!=-1){
				//OpenLayers.Filter.Logical.AND statement
				compareType = "&&";
				splitLen = WFSfilter.indexOf(" AND ");
				filter5.push(WFSfilter.substring(0,splitLen).trim());
				filter5.push(WFSfilter.substring(splitLen+5,strLen).trim());
			} else {
				//OpenLayers.Filter.Logical.OR statement
				compareType = "||";
				splitLen = WFSfilter.indexOf(" OR ");
				filter5.push(WFSfilter.substring(0,splitLen).trim());
				filter5.push(WFSfilter.substring(splitLen+4,strLen).trim());
			}
			
			//Is there still an AND/OR?
			if (filter5[1].indexOf(" AND ")!=-1 || filter5[1].indexOf(" OR ")!=-1){
				//ERROR - We can only process two conditions at present
				WFSfilterObj = "ERROR";
			} else {
				var filterLoop = 0;
				while (filterLoop < 2) {
					strLen = filter5[filterLoop].length;
					WFSfilter = filter5[filterLoop];
					
					//Process the WFSfilter string into constituent parts
					/*OpenLayers.Filter.Comparison.EQUAL_TO = ==;
					OpenLayers.Filter.Comparison.NOT_EQUAL_TO = !=;
					OpenLayers.Filter.Comparison.LESS_THAN = <;
					OpenLayers.Filter.Comparison.GREATER_THAN = >;
					OpenLayers.Filter.Comparison.LESS_THAN_OR_EQUAL_TO = <=;
					OpenLayers.Filter.Comparison.GREATER_THAN_OR_EQUAL_TO = >=;
					OpenLayers.Filter.Comparison.BETWEEN = ..;  (lowerBoundary and upperBoundary) - Not currently available
					OpenLayers.Filter.Comparison.LIKE = ~;
					OpenLayers.Filter.Comparison.IS_null = null;*/
					if (WFSfilter.indexOf("==") != -1) {
						//EQUAL_TO
						splitLen = WFSfilter.indexOf("==");
						filter1.push("==");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf("<>") != -1) {
						//NOT_EQUAL_TO
						splitLen = WFSfilter.indexOf("<>");
						filter1.push("!=");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf("<=") != -1) {
						//LESS_THAN_OR_EQUAL_TO
						splitLen = WFSfilter.indexOf("<=");
						filter1.push("<=");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf(">=") != -1) {
						//GREATER_THAN_OR_EQUAL_TO
						splitLen = WFSfilter.indexOf(">=");
						filter1.push(">=");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+3,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf("<") != -1) {
						//LESS_THAN
						splitLen = WFSfilter.indexOf("<");
						filter1.push("<");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+2,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf(">") != -1) {
						//GREATER_THAN
						splitLen = WFSfilter.indexOf(">");
						filter1.push(">");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+2,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf("IS NULL") != -1) {
						//IS NULL
						splitLen = WFSfilter.indexOf("IS NULL");
						filter1.push("null");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+8,strLen).trim());
						filter4.push(filterLoop);
					} else if(WFSfilter.indexOf("LIKE") != -1) {
						//LIKE
						splitLen = WFSfilter.indexOf("LIKE");
						filter1.push("~");
						filter2.push(WFSfilter.substring(0,splitLen-1).trim());
						filter3.push(WFSfilter.substring(splitLen+5,strLen).trim());
						filter4.push(filterLoop);
					} else {
						//Error, don't apply a WFS filter
						filter4.push(-1);
					}
					filterLoop = filterLoop + 1;
				}
				
				//Create a WFS filter
				if (filter4[0]!=-1 && filter4[1]!=-1){
					WFSfilterObj = new OpenLayers.Filter.Logical({
						type: compareType,
						filters: [
							new OpenLayers.Filter.Comparison({
								type: filter1[0],
								property: filter2[0],
								value: filter3[0]
							}),
							new OpenLayers.Filter.Comparison({
								type: filter1[1],
								property: filter2[1],
								value: filter3[1]
							})
						]
					});
				} else {
					WFSfilterObj = "ERROR";
				}
			}
		}
	}
	
	if (table1 == 'all') {
		//We need to apply this to all layers
		var boundingBoxi = 0;
		for (i=0;i<overlayArray.length;i++){
			//Now for the WFS layer
			overlayName = overlayArray[i];
			wfsName = wfsArray[i];
			
			if (WFSfilter!=''){
				if (WFSfilterObj!='ERROR'){
					window[wfsName].filter = WFSfilterObj;
					window[wfsName].refresh({force: true});
					try {
						filterStr = xml.write(filter_1_1.write(WFSfilterObj));
						params.filter = filterStr;
					} catch (err) {
						alert(err.message);
					}
					window[overlayName].mergeNewParams(params);
					window[overlayName].redraw();
					//Zoom to extent
					if (boundingBoxi == 0) {
						//first loop, set the bounding array
						if(window[wfsName].features.length>0){
							boundingBox = window[wfsName].getDataExtent();
							boundingBoxi = 1;
						} else {
							boundingBoxi = 0;
						}
					} else {
						//Update only if bigger
						if(window[wfsName].features.length>0){
							if(window[wfsName].getDataExtent().top >= boundingBox.top){
								boundingBox.top	= window[wfsName].getDataExtent().top;
							}
							if(window[wfsName].getDataExtent().bottom <= boundingBox.bottom){
								boundingBox.bottom	= window[wfsName].getDataExtent().bottom;
							}
							if(window[wfsName].getDataExtent().left <= boundingBox.left){
								boundingBox.left	= window[wfsName].getDataExtent().left;
							}
							if(window[wfsName].getDataExtent().right >= boundingBox.right){
								boundingBox.right	= window[wfsName].getDataExtent().right;
							}
						}
					}
				}
			} else {
				//Remove the filters
				window[wfsName].filter = null;
				window[wfsName].refresh({force: true});
				params.filter = null;
				window[overlayName].mergeNewParams(params);
				window[overlayName].redraw();
			}
		}
		//Zoom to extent - Disabled the zoomto box as this may be annoying
		//map.zoomToExtent(boundingBox);
		//map.zoom = 5;
	} else {
		//If we couldn't work out which overlay to refresh we will set it as the first to avoid confusion
		if (overlayName == '' || wfsName ==''){
			overlayName = overlayArray[0];
			wfsName = wfsArray[0];
			if (WFSfilter!=''){
				if (WFSfilterObj!='ERROR'){
					window[wfsName].filter = WFSfilterObj;
					window[wfsName].refresh({force: true});
					try {
						filterStr = xml.write(filter_1_1.write(WFSfilterObj));
						params.filter = filterStr;
					} catch (err) {
						alert(err.message);
					}
					window[overlayName].mergeNewParams(params);
					window[overlayName].redraw();
					//Zoom to extent - Disabled the zoomto box as this may be annoying
					if(window[wfsName].features.length>0){
						//map.zoomToExtent(window[wfsName].getDataExtent());
						//map.zoom = 5;
					}
				}
			} else {
				//Remove the filters
				window[wfsName].filter = null;
				window[wfsName].refresh({force: true});
				params.filter = null;
				window[overlayName].mergeNewParams(params);
				window[overlayName].redraw();
			}
		} else {
			if (WFSfilter!=''){
				if (WFSfilterObj!='ERROR'){
					window[wfsName].filter = WFSfilterObj;
					window[wfsName].refresh({force: true});
					try {
						filterStr = xml.write(filter_1_1.write(WFSfilterObj));
						params.filter = filterStr;
					} catch (err) {
						alert(err.message);
					}
					window[overlayName].mergeNewParams(params);
					window[overlayName].redraw();
					//Zoom to extent - Disabled the zoomto box as this may be annoying
					if(window[wfsName].features.length>0){
						//map.zoomToExtent(window[wfsName].getDataExtent());
						//map.zoom = 5;
					}
				}
			} else {
				//Remove the filters
				window[wfsName].filter = null;
				window[wfsName].refresh({force: true});
				params.filter = null;
				window[overlayName].mergeNewParams(params);
				window[overlayName].redraw();
			}
		}
	}
}

function searchRec(table, tableRef) {
	
	searchTranslator(table);
	
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	
	//Is this a geometry enabled table?
	if (tableGeomEdit[tableRef]=='Yes'){
		//Now we apply the new filter to the map
		
		// by default, reset all filters
		var filterParams = {
			filter: null
		};
		if (OpenLayers.String.trim(filterCQLString) != "") {
			//If the operator is possible with CQL apply the filter
			if (filterCQLString.indexOf("<>") == -1) {
				filterParams["filter"] = filterCQLString;
				// merge the new filter definitions
				mergeNewParams(filterParams, filterCQLString, table);
			} else {
				alert("Unfortunately it is not currently possible to apply this filter to the map; however the table has been updated.");
			}
		} else {
			// remove filters
			mergeNewParams(filterParams, '', table);
		}
	}
}

function updateRow(table, gid) {
	var fieldName;
	//This shows the hidden div so we need to pass some extra variables for the viewer on return
	
	recNo = document.getElementById('recnoS').value;
	lower = document.getElementById('lowerS').value;
	filter = document.getElementById('filterS').value;
	if (fieldName== 'Please Select Column') {
		updateTable();
	} else {
		if (filter.length > 0){
			tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=edit&gid=" + gid + "&recNo=" + recNo + "&lower=" + lower;
		} else {
			tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=edit&gid=" + gid + "&recNo=" + recNo + "&lower=" + lower + "&filter=" + filter;
		}
		updateTable(tableHTML, 'override');
	}
}

function lowerSet(recNo, lower){
	document.getElementById('recnoS').value = recNo;
	document.getElementById('lowerS').value = lower;
}

function backrecset(table, tableNo) {
	recNo = document.getElementById('recnoS').value;
	if (document.getElementById('filterS').value!=''){
		lower = document.getElementById('lower2S').value;
	} else {
		lower = document.getElementById('lowerS').value;
	}
	
	//We need to extract the correct lower value and then put it back together
	var tokensR = recNo.split('|');
	var tokensL = lower.split('|');
	tokensL[tableNo] = parseInt(tokensL[tableNo]) - parseInt(tokensR[tableNo]);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensL.length;i++){
		if (i==0){
			recNo += tokensR[i];
			lower += tokensL[i];
		} else {
			recNo += "|" + tokensR[i];
			lower += "|" + tokensL[i];
		}
	}
	if (document.getElementById('filterS').value!=''){
		document.getElementById('lower2S').value = lower;
	} else {
		document.getElementById('lowerS').value = lower;
	}
	updateTable();
}

function nextrecset(table, tableNo) {
	recNo = document.getElementById('recnoS').value;
	if (document.getElementById('filterS').value!=''){
		lower = document.getElementById('lower2S').value;
	} else {
		lower = document.getElementById('lowerS').value;
	}
	
	//We need to extract the correct lower value and then put it back together
	var tokensR = recNo.split('|');
	var tokensL = lower.split('|');
	tokensL[tableNo] = parseInt(tokensL[tableNo]) + parseInt(tokensR[tableNo]);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensL.length;i++){
		if (i==0){
			recNo += tokensR[i];
			lower += tokensL[i];
		} else {
			recNo += "|" + tokensR[i];
			lower += "|" + tokensL[i];
		}
	}
	if (document.getElementById('filterS').value!=''){
		document.getElementById('lower2S').value = lower;
	} else {
		document.getElementById('lowerS').value = lower;
	}
	updateTable();
}

function recNochange(tableNo, NEWrecNo) {
	//We need to extract the correct lower value and then put it back together
	recNo = document.getElementById('recnoS').value;
	var tokensR = recNo.split('|');
	tokensR[tableNo] = parseInt(NEWrecNo);
	
	recNo = "";
	lower = "";
	for (i=0;i<tokensR.length;i++){
		if (i==0){
			recNo += tokensR[i];
		} else {
			recNo += "|" + tokensR[i];
		}
	}
	document.getElementById('recnoS').value = recNo; //This is replaced
	
	updateTable();
} 

function updateFilters(filterstr,layerNam){
	if (layerNam == 'all'){
		for (i=0;i<wfsArray.length;i++){
			var filterParams = {
				filter: null
			};
	
			var layernum = i;
			var layerSw = "overlay" + layernum;
			var wfsSw = "wfs" + layernum;
			userFilters[layernum].filter = filterstr;
			var usfilter = userFilters[layernum].filter;
			var layfilter = legendFilters[layernum].filter;
			
			if (typeof layfilter.filters=='undefined' && layfilter.property==''){
				//No layer filter
				if (typeof usfilter.filters=='undefined' && usfilter.property==''){
					//No user filter
					window[layerSw].mergeNewParams(filterParams); //Update the WMS
					window[wfsSw].filter = null; //Update the wfs
				} else {
				//No layer filter but there is a user filter
					//Update the WMS
					try {
						filterParams.filter = xml.write(filter_1_1.write(userFilters[layernum].filter)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams); 
					
					window[wfsSw].filter = userFilters[layernum].filter; //Update the wfs
				}
			} else {
				//There is a layer filter
				if (typeof usfilter.filters=='undefined' && usfilter.property==''){
				//No user filter
					//Update the WMS
					try {
						filterParams.filter = xml.write(filter_1_1.write(legendFilters[layernum].filter)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams); 
					
					window[wfsSw].filter = legendFilters[layernum].filter; //Update the wfs
				} else {
				//Both filters apply
					//Update the WMS
					var tmpFL = new OpenLayers.Filter.Logical({
						type: '&&',
						filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
					});	
					try {
						filterParams.filter = xml.write(filter_1_1.write(tmpFL)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams);
					
					//Update the wfs
					window[wfsSw].filter = new OpenLayers.Filter.Logical({
						type: '&&',
						filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
					});	
				}
			}
			
			window[layerSw].redraw();
			window[wfsSw].refresh({force: true});
		}
	} else {
		// new option will allow specific layers to be predefined
		var filterParams = {
			filter: null
		};

		var layernum = parseInt(layerNam.replace("wfs",""));
		var layerSw = "overlay" + layernum;
		var wfsSw = "wfs" + layernum;
		userFilters[layernum].filter = filterstr;
		var usfilter = userFilters[layernum].filter;
		var layfilter = legendFilters[layernum].filter;
		
		if (typeof layfilter.filters=='undefined' && layfilter.property==''){
			//No layer filter
			if (typeof usfilter.filters=='undefined' && usfilter.property==''){
				//No user filter
				window[layerSw].mergeNewParams(filterParams); //Update the WMS
				window[wfsSw].filter = null; //Update the wfs
			} else {
			//No layer filter but there is a user filter
				//Update the WMS
				try {
					filterParams.filter = xml.write(filter_1_1.write(userFilters[layernum].filter)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams); 
				
				window[wfsSw].filter = userFilters[layernum].filter; //Update the wfs
			}
		} else {
			//There is a layer filter
			if (typeof usfilter.filters=='undefined' && usfilter.property==''){
			//No user filter
				//Update the WMS
				try {
					filterParams.filter = xml.write(filter_1_1.write(legendFilters[layernum].filter)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams); 
				
				window[wfsSw].filter = legendFilters[layernum].filter; //Update the wfs
			} else {
			//Both filters apply
				//Update the WMS
				var tmpFL = new OpenLayers.Filter.Logical({
					type: '&&',
					filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
				});	
				try {
					filterParams.filter = xml.write(filter_1_1.write(tmpFL)); 
				} catch (err) {
					alert(err.message);
				}
				window[layerSw].mergeNewParams(filterParams);
				
				//Update the wfs
				window[wfsSw].filter = new OpenLayers.Filter.Logical({
					type: '&&',
					filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
				});	
			}
		}
		
		window[layerSw].redraw();
		window[wfsSw].refresh({force: true});
	}
}

function pdmF(iteration) {
	//Filter name is stored in pdmArr, CQL filter is stored in pdmFilter and the URL filter in pdmUFilter
	var filterstr, filterArr;
	filterArr = pdmFilter[iteration].split('|');
	var loopLess = 0;
	var logicT = '';
	if (filterArr[0]=='AND'){
		//AND
		logicT = '&&';
		loopLess = 1;
	} else if (filterArr[0]=='NOT') {
		//NOT
		logicT = '!';
		loopLess = 1;
	} else if (filterArr[0]=='OR') {
		//OR
		logicT = '||';
		loopLess = 1;
	}
	if (loopLess!=0){
		//This is a multiple filter
		filterstr = new OpenLayers.Filter.Logical({
			type: logicT,
			filters: []
		});

		//OK we have now set up the logical, we now need to loop through the rest
		i = loopLess;
		while (i<filterArr.length){
			//What type of filter?
			if (filterArr[i+1]=='..'){
				//Between
				var tmpObj = new OpenLayers.Filter.Comparison({
					type:filterArr[i+1],
					property:filterArr[i],
					lowerBoundary:filterArr[i+2],
					upperBoundary:filterArr[i+3]
				});
				filterstr.filters.push(tmpObj);
				i = i+4;
			} else {
				//Value
				var tmpObj = new OpenLayers.Filter.Comparison({
					type:filterArr[i+1],
					property:filterArr[i],
					value:filterArr[i+2]
				});
				filterstr.filters.push(tmpObj);
				i = i+3;
			}
		}
	} else {
		//What type of filter?
		if (filterArr[1]=='..'){
			//Between
			filterstr = new OpenLayers.Filter.Comparison({
				type:filterArr[1],
				property:filterArr[0],
				lowerBoundary:filterArr[2],
				upperBoundary:filterArr[3]
			});
		} else {
			//This is a single filter
			filterstr = new OpenLayers.Filter.Comparison({
				type:filterArr[1],
				property:filterArr[0],
				value:filterArr[2]
			});
		}
	}
	
	if (OpenLayers.String.trim(pdmFilter[iteration]) != "") {
		// merge the new filter definitions
		updateFilters(filterstr,'all');
		//mergeNewParams(filterParams, '', 'all');
	} else {
		// remove filters
		filterstr = new OpenLayers.Filter.Comparison({type: '', property:'', value:''});
		updateFilters(filterstr,'all');
		//mergeNewParams(filterParams, '', 'all');
	}
		
	//Then we apply it to the table
	if (pdmUFilter[iteration] == ""){
		document.getElementById('filterS').value = "";
		updateTable();
	} else {
		document.getElementById('filterS').value = pdmUFilter[iteration] ;
		updateTable();
	}
	
	searchRecStyle(table);
}

function saveEdits() {
	//This is now a function which saves the records
	//First we update the php view to be equal to the save records function
	var oriQ = document.getElementById('urlS').value;
	if (table.indexOf('_view')!=-1){
		tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table.substring(0,table.indexOf('_view')) + "&function=geomsave&sid=" + session_id + "&geom=" + projMap2;
	
	} else {
		tableHTML = "../../apps/functions/results.php?tableWidth=" + tableWidth + "&table=" + table + "&function=geomsave&sid=" + session_id + "&geom=" + projMap2;
	}
	updateTable(tableHTML, 'override');
	//function updateTable is located in the mapdefinition.js file and will call the dynamite.php to calculate the edit arrays
	tableport.expand();
	document.getElementById('urlS').value = oriQ; //We delibrately leave this as the orignal so we know how to reset after updates 
	//Then we toggle the form
}

function editOver() {
	//This function resets after a geometry edit session
	updateTable();
	mapPanel.expand();
}

function geomEditForm(dir, table) {
	if (geomArray.length == 0){
		alert('There are no new records or edits to process');
		document.getElementById('blankDiv').innerHTML = "<img src='../../apps/functions/blank.jpg' onload='editOver()' />";
	}
	
	for (i=0;i<tableArray.length;i++){
		if(table == tableArray[i]){
			var tableRef = i;
		}
	}
	
	//This indicates the first run
	if (geomEdit == -1) {
		//Set this for the next record
		geomEdit = geomEdit + 1;
		
		//First we need to load the map for this record
		//Set up the map
		var boundsMini;
		if (projMap != "EPSG:27700"){
			boundsMini = new OpenLayers.Bounds(
				461952, 167208, 480155, 179442
			).transform(new OpenLayers.Projection("EPSG:27700"),new OpenLayers.Projection(projMap));
		} else {
			boundsMini = new OpenLayers.Bounds(
				461952, 167208, 480155, 179442
			);
		}

		var optionsMini = {
			maxExtent: boundsMini,
			maxResolution: 500,
			numZoomLevels: 20,
			projection: projMap,
			units: 'm'
		};
		mapMini = new OpenLayers.Map('geomEditMap', optionsMini);
		
		BMapMini = window[basemaps[basemaps.length-1]]; //Picks the last map in the basemaps set 
				
		//Set a blue style for the feature on the map
		var defStyleMini = {
			strokeColor: "blue", 
			strokeOpacity: 0.5,
			fillOpacity: 0.5,
			fillColor: "blue"
		};
		var styMini = OpenLayers.Util.applyDefaults(defStyleMini, OpenLayers.Feature.Vector.style["default"]);
		var smMini = new OpenLayers.StyleMap({
			'default': styMini
		});
		//Create the temporary vector layer
		geomOL = new OpenLayers.Layer.Vector("temporary layer", {
			styleMap: smMini
		});
		//Insert the feature into the temporary vector layer
		var geomStr = geometryArray[geomEdit];
		var feature = new OpenLayers.Format.WKT().read(geomStr);
		geomOL.addFeatures(feature);
		
		//Add the layer to the map
		mapMini.addLayers([BMapMini, geomOL]);
		
		//Get the centre point and centre the map
		var GeomCenter = feature.geometry.getCentroid();
		GeomCenter = new OpenLayers.LonLat(GeomCenter.x, GeomCenter.y);
		mapMini.setCenter(GeomCenter, 5);
		
		if (geomEdit == (geometryArray.length-1)) {
			//This is the last record change the div style
			document.getElementById('geomNext').style.visibility = "hidden";
			document.getElementById('geomSave').style.visibility = "visible";
			document.getElementById('geomNext2').style.visibility = "hidden";
			document.getElementById('geomSave2').style.visibility = "visible";
		}
		
		//First run, populate the first record
		var fieldNo = fieldNames.length;
		var tmpT = "";
		var tmpArray = [];
		var tmpObj, subgeom;

		for (i=0;i<fieldNo;i++){
			//Loop through the fields
			tmpT = "col" + fieldNames[i];
			tmpArray = window[tmpT];
			tmpT = "H" + fieldNames[i];
			tmpObj = document.getElementById(tmpT);
			if (tmpObj == null) {
				// variable is not defined
				tmpT = "S" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj == null) {
					// variable is not defined
					tmpT = "T" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj == null) {
						// variable is not defined
						tmpT = "O" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "C" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpObj = ''; //This is an error
							}
						}
					}
				}
			}

			if (fieldNames[i] != 'the_geom' && fieldNames[i] != 'geom_type') {
				tmpObj.value = tmpArray[geomEdit].trim();
			} else if (fieldNames[i] == 'the_geom') {
				tmpObj.value = geomArray[geomEdit];
			} else if (fieldNames[i] == 'geom_type') {
				if (tmpArray[geomEdit].trim().length !=0){
					tmpObj.value = tmpArray[geomEdit].trim();
				} else {
					subgeom = geometryArray[geomEdit].indexOf('(');
					subgeom = geometryArray[geomEdit].substr(0,subgeom);
					if (subgeom == 'POINT' || subgeom == 'MULTIPOINT') {
						tmpObj.value = 'POINT';
					} else if (subgeom == 'LINESTRING' || subgeom == 'MULTILINESTRING') {
						tmpObj.value = 'LINESTRING';
					} else if (subgeom == 'POLYGON' || subgeom == 'MULTIPOLYGON') {
						tmpObj.value = 'POLYGON';
					} else {
						tmpObj.value = subgeom;
					}
				}
			}
		}
		document.getElementById('tmpgid').value = tmpgidA[geomEdit];
		document.getElementById('tmptable').value = tmptableA[geomEdit];
	} else {
		//Not the first run
		
		//Is this a forward or backwards move?
		if (dir == 'f') {
			//alert("f");
			//Pickup the values which may have been changed
			var fieldNo = fieldNames.length;
			var tmpT = "";
			var tmpArray = [];
			var tmpObj;
			for (i=0;i<fieldNo;i++){
				//Loop through the fields
				tmpT = "H" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj == null) {
					// variable is not defined
					tmpT = "S" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj == null) {
						// variable is not defined
						tmpT = "T" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "O" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpT = "C" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj == null) {
									// variable is not defined
									tmpObj = ''; //This is an error
								}
							}
						}
					}
				}
				tmpT = "col" + fieldNames[i];
				window[tmpT][geomEdit] = tmpObj.value;
			}
			
			//Forward
			geomEdit = geomEdit + 1;
			
			//Populate the table with the next record
			
			tmpT = "";
			tmpArray = [];
			for (i=0;i<fieldNo;i++){
				//Loop through the fields
				tmpT = "col"  + fieldNames[i];
				tmpArray = window[tmpT];
				tmpT = "H" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj == null) {
					// variable is not defined
					tmpT = "S" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj == null) {
						// variable is not defined
						tmpT = "T" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "O" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpT = "C" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj == null) {
									// variable is not defined
									tmpObj = ''; //This is an error
								}
							}
						}
					}
				}
				if (fieldNames[i] != 'the_geom' && fieldNames[i] != 'geom_type') {
					tmpObj.value = tmpArray[geomEdit].trim();
				} else if (fieldNames[i] == 'the_geom') {
					tmpObj.value = geomArray[geomEdit];
				} else if (fieldNames[i] == 'geom_type') {
					if (tmpArray[geomEdit].trim().length !=0){
						tmpObj.value = tmpArray[geomEdit].trim();
					} else {
						subgeom = geometryArray[geomEdit].indexOf('(');
						subgeom = geometryArray[geomEdit].substr(0,subgeom);
						if (subgeom == 'POINT' || subgeom == 'MULTIPOINT') {
							tmpObj.value = 'POINT';
						} else if (subgeom == 'LINESTRING' || subgeom == 'MULTILINESTRING') {
							tmpObj.value = 'LINESTRING';
						} else if (subgeom == 'POLYGON' || subgeom == 'MULTIPOLYGON') {
							tmpObj.value = 'POLYGON';
						} else {
							tmpObj.value = subgeom;
						}
					}
				}
			}
			document.getElementById('tmpgid').value = tmpgidA[geomEdit];
			document.getElementById('tmptable').value = tmptableA[geomEdit];
			
			//Remove the previous feature
			geomOL.removeAllFeatures();
			
			//Insert the feature into the temporary vector layer
			var geomStr = geometryArray[geomEdit];
			var feature = new OpenLayers.Format.WKT().read(geomStr);
			geomOL.addFeatures(feature);
			
			//Get the centre point and centre the map
			var GeomCenter = feature.geometry.getCentroid();
			GeomCenter = new OpenLayers.LonLat(GeomCenter.x, GeomCenter.y);
			mapMini.setCenter(GeomCenter, 5);
			
			if (geomEdit == (geometryArray.length-1)) {
				//This is the last record change the div style
				document.getElementById('geomNext').style.visibility = "hidden";
				document.getElementById('geomSave').style.visibility = "visible";
				document.getElementById('geomNext2').style.visibility = "hidden";
				document.getElementById('geomSave2').style.visibility = "visible";
			}
			if (geomEdit > 0) {
				document.getElementById('geomPrev').style.visibility = "visible";
				document.getElementById('geomPrev2').style.visibility = "visible";
			}
		} else if (dir == 'b') {
			//alert("b");
			//Pickup the values which may have been changed
			var fieldNo = fieldNames.length;
			var tmpT = "";
			var tmpArray = [];
			var tmpObj;
			for (i=0;i<fieldNo;i++){
				//Loop through the fields
				tmpT = "H" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj == null) {
					// variable is not defined
					tmpT = "S" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj == null) {
						// variable is not defined
						tmpT = "T" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "O" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpT = "C" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj == null) {
									// variable is not defined
									tmpObj = ''; //This is an error
								}
							}
						}
					}
				}
				tmpT = "col" + fieldNames[i];
				window[tmpT][geomEdit] = tmpObj.value;
			}
			
			//Back
			geomEdit = geomEdit - 1;
			
			//Populate the table with the next record
			
			tmpT = "";
			tmpArray = [];
			tmpObj;
			for (i=0;i<fieldNo;i++){
				//Loop through the fields
				tmpT = "col" + fieldNames[i];
				tmpArray = window[tmpT];
				tmpT = "H" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj == null) {
					// variable is not defined
					tmpT = "S" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj == null) {
						// variable is not defined
						tmpT = "T" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "O" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpT = "C" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj == null) {
									// variable is not defined
									tmpObj = ''; //This is an error
								}
							}
						}
					}
				}
				if (fieldNames[i] != 'the_geom' && fieldNames[i] != 'geom_type') {
					tmpObj.value = tmpArray[geomEdit].trim();
				} else if (fieldNames[i] == 'the_geom') {
					tmpObj.value = geomArray[geomEdit];
				} else if (fieldNames[i] == 'geom_type') {
					if (tmpArray[geomEdit].trim().length !=0){
						tmpObj.value = tmpArray[geomEdit].trim();
					} else {
						subgeom = geometryArray[geomEdit].indexOf('(');
						subgeom = geometryArray[geomEdit].substr(0,subgeom);
						if (subgeom == 'POINT' || subgeom == 'MULTIPOINT') {
							tmpObj.value = 'POINT';
						} else if (subgeom == 'LINESTRING' || subgeom == 'MULTILINESTRING') {
							tmpObj.value = 'LINESTRING';
						} else if (subgeom == 'POLYGON' || subgeom == 'MULTIPOLYGON') {
							tmpObj.value = 'POLYGON';
						} else {
							tmpObj.value = subgeom;
						}
					}
				}
			}
			document.getElementById('tmpgid').value = tmpgidA[geomEdit];
			document.getElementById('tmptable').value = tmptableA[geomEdit];
			
			//Remove the previous feature
			geomOL.removeAllFeatures();
			
			//Insert the feature into the temporary vector layer
			var geomStr = geometryArray[geomEdit];
			var feature = new OpenLayers.Format.WKT().read(geomStr);
			geomOL.addFeatures(feature);
			
			//Get the centre point and centre the map
			var GeomCenter = feature.geometry.getCentroid();
			GeomCenter = new OpenLayers.LonLat(GeomCenter.x, GeomCenter.y);
			mapMini.setCenter(GeomCenter, 5);
			
			if (geomEdit == 0) {
				document.getElementById('geomPrev').style.visibility = "hidden";
				document.getElementById('geomPrev2').style.visibility = "hidden";
			}
			if (geomEdit < (geometryArray.length-1)) {
				document.getElementById('geomSave').style.visibility = "hidden";
				document.getElementById('geomNext').style.visibility = "visible";
				document.getElementById('geomSave2').style.visibility = "hidden";
				document.getElementById('geomNext2').style.visibility = "visible";
			}
		} else if (dir == 's') {
			//This is a save records call
			//OK, first we need to run a changes save incase the user made changes before clicking save
			//This is easy as it is the same process as used for the forward / backward scripts
			var respondT = "";
			var fieldNo = fieldNames.length;
			var tmpT = "";
			var tmpArray = [];
			var tmpObj;
			for (i=0;i<fieldNo;i++){
				tmpT = "H" + fieldNames[i];
				tmpObj = document.getElementById(tmpT);
				if (tmpObj != null) {
					// variable is defined
					tmpT = "col" + fieldNames[i];
					window[tmpT][geomEdit] = tmpObj.value.replace(/&/g,'chr(38)');
				} else {
					tmpT = "S" + fieldNames[i];
					tmpObj = document.getElementById(tmpT);
					if (tmpObj != null) {
						// variable is defined
						tmpT = "col"  + fieldNames[i];
						window[tmpT][geomEdit] = tmpObj.value;
					} else {
						tmpT = "T" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj != null) {
							// variable is defined
							tmpT = "col"  + fieldNames[i];
							window[tmpT][geomEdit] = tmpObj.value.replace(/&/g,'chr(38)');
						} else {
							tmpT = "O" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj != null) {
								// variable is defined
								//alert(tmpObj.name);
								tmpT = "col"  + fieldNames[i];
								window[tmpT][geomEdit] = tmpObj.name;
							} else {
								tmpT = "C" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj != null) {
									// variable is defined
									tmpT = "col" + fieldNames[i];
									window[tmpT][geomEdit] = tmpObj.value.replace(/&/g,'chr(38)');
								}
							}
						}
					}
				}
			}
			var tmpgid = document.getElementById('tmpgid').value;
			var tmptable = document.getElementById('tmptable').value;
			
			//Create a postgres safe datetimestamp
			var cDT = new Date();
			//Get timezone
			var TZ = cDT.toUTCString(); 
			TZ = TZ.substring(TZ.length-3);
			//Pad the numbers below 10
			var MDT = cDT.getMonth()+1;
			if (MDT < 10) {
				MDT = '0' + MDT;
			} 
			var DDT = cDT.getDate();
			if (DDT < 10) {
				DDT = '0' + DDT;
			}
			var HDT = cDT.getHours();
			if (HDT < 10) {
				HDT = '0' + HDT;
			}
			var MmDT = cDT.getMinutes();
			if (MmDT < 10) {
				MmDT = '0' + MmDT;
			}
			var SDT = cDT.getSeconds();
			if (SDT < 10) {
				SDT = '0' + SDT;
			}
			var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
			
			//Right, now we need to generate the SQL statements for each record and then run a php query
			//We will process each record using javascript then AJAX a php call
			
			//Important note, we need to check if it is an insert or update!
			var loopLen = geometryArray.length; //How many records do we need to save
			var i2, i3, insertType, queryStr, queryStr2, queryStr3, synNull, phpURL, gidVal;
			
			//Loop through the records
			var queryStrA = [];
			var queryStrB = [];
			for (i=0;i<loopLen;i++){
				//Check for gid
				insertType = 0;
				gidVal = '';
				for (i2=0;i2<fieldNo;i2++){
					if (fieldNames[i2] == 'gid') {
						tmpT = "col" + fieldNames[i2];
						if (window[tmpT][i].length == 0) {
							insertType = 1;
						} else {
							gidVal = window[tmpT][i];
						}
					}
				}
				
				if (insertType == 1) {
					queryStr = "qstr=INSERT";
				} else {
					queryStr = "qstr=UPDATE";
				} 
				queryStr += "&table=" + table + "&";
				i3 = 0;
				for (i2=0;i2<fieldNo;i2++){
					//Set the mod fields (these are automatic)
					tmpT = "col" + fieldNames[i2];
					if (fieldNames[i2] == 'mod_by' || fieldNames[i2] == 'mod_date') {
						if (fieldNames[i2] == 'mod_by'){
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = usertext;
						} else if (fieldNames[i2] == 'mod_date') {
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = currentDT;
						} 
					} else {
						if (window[tmpT][i] == '' || window[tmpT][i] == 'Undefined' || window[tmpT][i] == '\n' || window[tmpT][i] == 'null'){
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = 'null';
						} else {
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = window[tmpT][i];
						}
					}
					if (i2==0 && i3==0){
						queryStr += queryStr2 + "'" + queryStr3 + "'";
					} else if (i3==0) {
						queryStr += "&" + queryStr2 + "'" + queryStr3 + "'";
					}
				}
				queryStr = encodeURI(queryStr);
				queryStrA.push(queryStr);
				queryStrB.push("qstr=DROP&table=" + tmptableA[i] + "&gid=" + tmpgidA[i]);
			}
			
			runGeomQ(queryStrA,queryStrB,0,1,table);
		} else if (dir == 'cancel') {
			var checkSure = confirm("Are you sure you wish to delete this edit?");
			if (checkSure==true) {
				//OK, we need to remove the geometry from the temporary file
				var tmpgid = document.getElementById('tmpgid').value;
				var tmptable = document.getElementById('tmptable').value;
				qCallStr = "qstr=DROP&table=" + tmptable + "&gid=" + tmpgid;
				var none = ['none']; //Fake array needed to make the function run a single loop
				runGeomQ(qCallStr,none, 0, 3,table); //zero is less that none array length so will run a loop; 3 so only one loop will run and also tells the script that the first variable is not an array
				
				var tmpT = "";
				var tmpArray = [];
				var tmpObj;
				var fieldNo = fieldNames.length;
				//remove the values from the temporary values arrays
				gidArray.splice(geomEdit,1);
				geomArray.splice(geomEdit,1);
				geometryArray.splice(geomEdit,1);
				geomTarray.splice(geomEdit,1);
				tmpgidA.splice(geomEdit,1);
				tmptableA.splice(geomEdit,1);
				for (i=0;i<fieldNo;i++){
					//Loop through the fields
					tmpT = "col" + fieldNames[i];
					window[tmpT].splice(geomEdit,1);
				}
				
				//Next we check to see if there is still a record to go back
				if (geometryArray.length > 0) {
					//If yes, go back one record
					geomEdit = geomEdit - 1;
					if (geomEdit == -1) {
						geomEdit = 0; //They may have removed the first record
					}
					
					//Populate the table with the next record
					tmpT = "";
					tmpArray = [];
					for (i=0;i<fieldNo;i++){
						//Loop through the fields
						tmpT = "col"  + fieldNames[i];
						tmpArray = window[tmpT];
						tmpT = "H" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj == null) {
							// variable is not defined
							tmpT = "S" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj == null) {
								// variable is not defined
								tmpT = "T" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj == null) {
									// variable is not defined
									tmpT = "O" + fieldNames[i];
									tmpObj = document.getElementById(tmpT);
									if (tmpObj == null) {
										// variable is not defined
										tmpT = "C" + fieldNames[i];
										tmpObj = document.getElementById(tmpT);
										if (tmpObj == null) {
											// variable is not defined
											tmpObj = ''; //This is an error
										}
									}
								}
							}
						}
						if (fieldNames[i] != 'the_geom' && fieldNames[i] != 'geom_type') {
							tmpObj.value = tmpArray[geomEdit].trim();
						} else if (fieldNames[i] == 'the_geom') {
							tmpObj.value = geomArray[geomEdit];
						} else if (fieldNames[i] == 'geom_type') {
							if (tmpArray[geomEdit].trim().length !=0){
								tmpObj.value = tmpArray[geomEdit].trim();
							} else {
								subgeom = geometryArray[geomEdit].indexOf('(');
								subgeom = geometryArray[geomEdit].substr(0,subgeom);
								if (subgeom == 'POINT' || subgeom == 'MULTIPOINT') {
									tmpObj.value = 'POINT';
								} else if (subgeom == 'LINESTRING' || subgeom == 'MULTILINESTRING') {
									tmpObj.value = 'LINESTRING';
								} else if (subgeom == 'POLYGON' || subgeom == 'MULTIPOLYGON') {
									tmpObj.value = 'POLYGON';
								} else {
									tmpObj.value = subgeom;
								}
							}
						}
					}
					document.getElementById('tmpgid').value = tmpgidA[geomEdit];
					document.getElementById('tmptable').value = tmptableA[geomEdit];
					
					//Remove the previous feature
					geomOL.removeAllFeatures();
					
					//Insert the feature into the temporary vector layer
					var geomStr = geometryArray[geomEdit];
					var feature = new OpenLayers.Format.WKT().read(geomStr);
					geomOL.addFeatures(feature);
					
					//Get the centre point and centre the map
					var GeomCenter = feature.geometry.getCentroid();
					GeomCenter = new OpenLayers.LonLat(GeomCenter.x, GeomCenter.y);
					mapMini.setCenter(GeomCenter, 5);
					
					if (geomEdit == 0) {
						document.getElementById('geomPrev').style.visibility = "hidden";
						document.getElementById('geomPrev2').style.visibility = "hidden";
					}
					if (geomEdit < (geometryArray.length-1)) {
						document.getElementById('geomSave').style.visibility = "hidden";
						document.getElementById('geomNext').style.visibility = "visible";
						document.getElementById('geomSave2').style.visibility = "hidden";
						document.getElementById('geomNext2').style.visibility = "visible";
					}
				} else {
					//If no, reset the view back to the map
					document.getElementById('functionS').value = "view";
					updateTable();
					geomEdit = -1;
					mapPanel.expand();
				}
			} 
		}
	}
}

var i4, i5;
function runGeomQ(queryStrA,queryStrB, i4, i5, table){
	//Get the overlay name for refresh
	overlayName = '';
	for (i=0;i<overlayArray.length;i++){
		if(overlayTable[i]==table){
			overlayName = overlayArray[i];
		}
	}
	//If we couldn't work out which overlay to refresh we will set it as the first to avoid confusion
	if (overlayName == ''){
		overlayName = overlayArray[0];
	}
	
	var i6;
	var fieldNo = fieldNames.length;
	if (i4 < queryStrB.length) {
		var xhr = false;
		if (window.ActiveXObject){
			xhr = new ActiveXObject("Microsoft.XMLHTTP");
		} else {
			xhr = new XMLHttpRequest();
		}
			
		//Develop the query string and run it
		if (i5 == 1) {
			phpURL = queryStrA[i4];
		} else if (i5 == 2){
			phpURL = queryStrB[i4];
		} else if (i5 == 3){
			phpURL = queryStrA;
		}
		i6 = 1;
		xhr.open("POST","../../apps/functions/multied.php",true); 
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send(phpURL);
		xhr.onreadystatechange = function () {
			if (xhr.readyState == 4 && xhr.status == 200){
				respondT = xhr.responseText;
				if (respondT == 'OK') {
					//success
					if (i5 == 2) {
						//Both array queries have been run
						pointLayer.refresh({force:true});
						lineLayer.refresh({force:true});
						polygonLayer.refresh({force:true});
						simplePolygonLayer.refresh({force:true});
						wfs0.refresh({force:true});
						window[overlayName].redraw();
						
						//remove the values from the temporary values arrays
						gidArray.splice(0,1);
						geomArray.splice(0,1);
						geometryArray.splice(0,1);
						geomTarray.splice(0,1);
						tmpgidA.splice(0,1);
						tmptableA.splice(0,1);
						for (i6=0;i6<fieldNo;i6++){
							//Loop through the fields
							tmpT = "col" + fieldNames[i6];
							window[tmpT].splice(0,1);
						}
						i5 = 1;
						i4 = i4 + 1;
					} else if (i5 == 3) {
						//Just one loop
						pointLayer.refresh({force:true});
						lineLayer.refresh({force:true});
						polygonLayer.refresh({force:true});
						simplePolygonLayer.refresh({force:true});
						wfs0.refresh({force:true});
						window[overlayName].redraw();
						i4 = i4 + 1;
					} else {
						//The save has been done but the temporary tables have not be fixed yet
						i5 = 2;
					}
					//Run it again 
					runGeomQ(queryStrA,queryStrB, i4, i5, table);
				} else {
					alert(respondT); //ERROR Message
					return false;
				} 
			}
		}
	} else {
		//We have successfully reached the end but have we saved everything?
		if (i5 < 3) {
			if (geometryArray.length == 0){
				//We have saved everything - reset the view back to the map
				document.getElementById('functionS').value = "view";
				updateTable();
				mapPanel.expand();
				geomEdit = -1; //Reset the geomEdit number
			} else {
				alert("An error has occurred");
			}
		}
	}
}

function gedCall(table2, funk, gid, callerrow) {
	//Which table is this?
	for (i=0;i<tableArray.length;i++){
		if(table2 == tableArray[i]){
			var tableRef = i;
		}
	}
	
	//Get the overlay name for refresh
	overlayName = '';
	for (i=0;i<overlayArray.length;i++){
		if(overlayTable[i]==table2){
			overlayName = overlayArray[i];
		}
	}
	//If we couldn't work out which overlay to refresh we will set it as the first to avoid confusion
	if (overlayName == ''){
		overlayName = overlayArray[0];
	}

	//Is it valid?
	var eerr;
	var validF = validateForm();
	if (validF == false) {
		eerr = 1;
	}

	if (eerr != 1){
		if (funk == 'reset') {
			var checkSure = confirm("Are you sure you wish to cancel? All changes will be lost!");
			if (checkSure==true) {
				document.getElementById('functionS').value = "view";
				updateTable();
			}
		} else {
			defineFieldNames(table2);

			var i2, i3, insertType, queryStr, queryStr2, queryStr3, queryStr4, synNull, xhr3, phpURL, gidVal;
			xhr3 = false;
			if (window.ActiveXObject){
				xhr3 = new ActiveXObject("Microsoft.XMLHTTP");
			} else {
				xhr3 = new XMLHttpRequest();
			}
			
			var fieldNo = fieldNames.length;
			var tmpT = "";
			var tmpObj;
			var fieldVSingle = [];
			//The first job is to pick up the user inputs from the edit forms
			if (funk != 'drop'){
				if (funk != 'supdate'){
					for (i=0;i<fieldNo;i++){
						tmpT = "H" + fieldNames[i];
						tmpObj = document.getElementById(tmpT);
						if (tmpObj != null) {
							// variable is defined
							fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
						} else {
							tmpT = "S" + fieldNames[i];
							tmpObj = document.getElementById(tmpT);
							if (tmpObj != null) {
								// variable is defined
								fieldVSingle.push(tmpObj.value);
							} else {
								tmpT = "T" + fieldNames[i];
								tmpObj = document.getElementById(tmpT);
								if (tmpObj != null) {
									// variable is defined
									fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
								} else {
									tmpT = "O" + fieldNames[i];
									tmpObj = document.getElementById(tmpT);
									if (tmpObj != null) {
										// variable is defined
										if (tmpObj.checked == true) {
											fieldVSingle.push("on");
										} else {
											fieldVSingle.push("off");
										}
									} else {
										tmpT = "C" + fieldNames[i];
										tmpObj = document.getElementById(tmpT);
										if (tmpObj != null) {
											// variable is defined
											fieldVSingle.push(tmpObj.value.replace(/&/g,'chr(38)'));
										}
									}
								}
							}
						}
						if (fieldNames[i]=='gid'){
							if (isNumber(tmpObj.value)) {
								gidVal = tmpObj.value;
							} else {
								gidVal = '';
							}
						}
					}
				}
			} else {
				//This is a drop command so we don't need all the searching through update fields
				gidVal = gid;
			}

			//Create a postgres safe datetimestamp
			var cDT = new Date();
			//Get timezone
			var TZ = cDT.toUTCString();
			TZ = TZ.substring(TZ.length-3);
			//Pad the numbers below 10
			var MDT = cDT.getMonth()+1;
			if (MDT < 10) {
				MDT = '0' + MDT;
			}
			var DDT = cDT.getDate();
			if (DDT < 10) {
				DDT = '0' + DDT;
			}
			var HDT = cDT.getHours();
			if (HDT < 10) {
				HDT = '0' + HDT;
			}
			var MmDT = cDT.getMinutes();
			if (MmDT < 10) {
				MmDT = '0' + MmDT;
			}
			var SDT = cDT.getSeconds();
			if (SDT < 10) {
				SDT = '0' + SDT;
			}
			var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;

			//Next we create a query
			//We will process each record using javascript then AJAX a php call
			var fieldLimit = 0;
			if (funk == 'insert') {
				queryStr4 = "qstr=INSERT";
			} else if (funk == 'update') {
				queryStr4 = "qstr=UPDATE";
			} else if (funk == 'supdate') {
				queryStr4 = "qstr=SUPDATE";
				fieldLimit = 1;
            } else if (funk == 'insert') {
                queryStr4 = "qstr=INSERT";
			} else if (funk == 'drop') {
				queryStr4 = "qstr=DROP";
			}
			//queryStr4 += "&table=" + table2;
			queryStr4 += "&table='" + table2 + "'&";
			var excludeIt;
			if (funk != 'drop'){
				i3 = 0;
				i4 = 0;
				for (i2=0;i2<fieldNo;i2++){
					//Set the mod fields (these are automatic)
					if (fieldNames[i2] == 'mod_by' || fieldNames[i2] == 'mod_date') {
						if (fieldNames[i2] == 'mod_by'){
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = usertext;
							i3 = i3 + 1;
							i4 = i4 + 1;
						} else if (fieldNames[i2] == 'mod_date') {
							queryStr2 = fieldNames[i2] + "=";
							queryStr3 = currentDT;
							i3 = i3 + 1;
							i4 = i4 + 1;
						}
					} else {
						if (fieldLimit==1) {
							if (fieldNames[i2] == 'gid' ){
								queryStr2 = fieldNames[i2] + "=";
								queryStr3 = gid;
								i3 = i3 + 1;
								i4 = i4 + 1;
							} else if (fieldNames[i2] == statusField[tableRef]) {
								queryStr2 = fieldNames[i2] + "=";
								queryStr3 = document.getElementById(callerrow).value;
								if (queryStr3 != true && queryStr3 != false){
									queryStr3 = queryStr3.replace(/,/g,"%2C");
								}
								i3 = i3 + 1;
								i4 = i4 + 1;
							} else {
								//otherwise we exclude the field
								i3 = 0;
							}
						} else if (fieldLimit==0) {
							if (fieldVSingle[i2] == '' || fieldVSingle[i2] == 'Undefined' || fieldVSingle[i2] == '\n' || fieldVSingle[i2] == 'null'){
								queryStr2 = fieldNames[i2] + "=";
								queryStr3 = 'null';
								i3 = i3 + 1;
								i4 = i4 + 1;
							} else {
								queryStr2 = fieldNames[i2] + "=";
								queryStr3 = fieldVSingle[i2];
								if (queryStr3 != true && queryStr3 != false){
									queryStr3 = queryStr3.replace(/,/g,"%2C");
								}
								i3 = i3 + 1;
								i4 = i4 + 1;
							}
						}
					}
					if (i4==1 && i3!=0){
						queryStr4 += queryStr2 + "'" + queryStr3 + "'";
					} else if (i4>1 && i3!=0) {
						queryStr4 += "&" + queryStr2 + "'" + queryStr3 + "'";
					}
				}
			} else {
				queryStr4 += "gid=" + gidVal;
			}
			queryStr4 = encodeURI(queryStr4);
			//alert(queryStr4);

			//Now we run the function
			if(funk == 'drop') {
				var checkSure = confirm("Are you sure you wish to delete this row? It may not be possible to restore this data later!");
				//alert(queryStr4);
				if (checkSure==true) {
					phpURL = "../../apps/functions/multied.php";
					xhr3.open("POST",phpURL,true); // Insert a reference of the php page you wanna get instead of yourpage.php
					xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
					xhr3.send(queryStr4);

					//Report back on whether or not the edit was sucessful
					xhr3.onreadystatechange = function () {
						if (xhr3.readyState == 4 && xhr3.status == 200){
							respondT = xhr3.responseText;
							if (respondT != 'OK') {
								alert(respondT); //ERROR Message
							} else {
								//Successful save
								//Refresh the screen to previous use
								wfs0.refresh({force:true});
								window[overlayName].redraw();
								document.getElementById('functionS').value = "view";
								if (funk == 'drop') {
									document.getElementById('currGID').value = "";
								}
								updateTable();
							}
						} else {
							if (xhr3.status != 200){
								alert('Edit number ' + geomEdit + ' was skipped due to a query error!');
							}
						}
					}
				}
			} else {
				phpURL = "../../apps/functions/multied.php";
				//alert(queryStr4);
				xhr3.open("POST",phpURL,true); // Insert a reference of the php page you wanna get instead of yourpage.php
				xhr3.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr3.send(queryStr4);

				//Report back on whether or not the edit was sucessful
				xhr3.onreadystatechange = function () {
					if (xhr3.readyState == 4 && xhr3.status == 200){
						respondT = xhr3.responseText;
						if (respondT != 'OK') {
							alert(respondT); //ERROR Message
						} else {
							//Successful save
							//Refresh the screen to previous use
							wfs0.refresh({force:true});
							window[overlayName].redraw();
							document.getElementById('functionS').value = "view";
							if (funk == 'drop') {
								document.getElementById('currGID').value = "";
							}
							updateTable();
						}
					} else {
						if (xhr3.status != 200){
							alert('Edit number ' + geomEdit + ' was skipped due to a query error!');
						}
					}
				}
			}
		}
	}
}

function editMap(geom) {
	//Set up the map
	var bounds2;
	if (projMap != "EPSG:27700"){
		bounds2 = new OpenLayers.Bounds(
			461952, 167208, 480155, 179442
		).transform(new OpenLayers.Projection("EPSG:27700"),new OpenLayers.Projection(projMap));
	} else {
		bounds2 = new OpenLayers.Bounds(
			461952, 167208, 480155, 179442
		);
	}

	var options2 = {
		maxExtent: bounds2,
		maxResolution: 500,
		numZoomLevels: 20,
		projection: projMap,
		units: 'm',
		controls: [
			new OpenLayers.Control.LayerSwitcher(),
			new OpenLayers.Control.PanZoomBar()
		]
	};
	map3 = new OpenLayers.Map('EditMap', options2);
	BMapMini2 = window[basemaps[basemaps.length-1]]; //Picks the last map in the basemaps set 
			
	//Set a blue style for the feature on the map
	var defStyle2 = {
		strokeColor: "blue", 
		strokeOpacity: 0.5,
		fillOpacity: 0.5,
		fillColor: "blue"
	};
	var sty2 = OpenLayers.Util.applyDefaults(defStyle2, OpenLayers.Feature.Vector.style["default"]);
	var sm2 = new OpenLayers.StyleMap({
		'default': sty2
	});
	//Create the temporary vector layer
	var geomOL2 = new OpenLayers.Layer.Vector("temporary layer", {
		styleMap: sm2
	});
	//Insert the feature into the temporary vector layer
	var geomStr2 = geom;
	var feature2 = new OpenLayers.Format.WKT().read(geomStr2);
	geomOL2.addFeatures(feature2);
	
	//Add the layer to the map
	map3.addLayers([BMapMini2, geomOL2]);
	
	//Get the centre point and centre the map
	var GeomCenter2 = feature2.geometry.getCentroid();
	GeomCenter2 = new OpenLayers.LonLat(GeomCenter2.x, GeomCenter2.y);
	map3.setCenter(GeomCenter2, 5);
}

//The next three functions toggle the three control arrays, the activate / deactivate option is to remove null values quickly
function edtoggleControl(element) {
	for(key in controls) {
		var control = controls[key];
		if(element == key) {
			control.activate();
		} else {
			if (control.active == null) {
				control.activate();
				control.deactivate();
			} else {
				control.deactivate();
			}
		}
	}
}

var infoTogs = [];
var existingToedit = 'N';
function edtoggleControl2(element) {
	if (element == 'sC') {
		//This is a special case for switching existing to editable
		existingToedit = 'Y';
		//This next loop switches the select tools on and off
		for (i=0;i<wfsArray.length;i++){
			
			var tmpON2 = "sH" + i;
			if (window[tmpON2].active == null){
				if (window["overlay" + i].visibility == true){
					window[tmpON2].activate();
				}
			} else if (window[tmpON2].active == false){
				if (window["overlay" + i].visibility == true){
					window[tmpON2].activate();
				}
			} else {
				window[tmpON2].deactivate();
			}
		}
	} else if (element == 'none') {
		//Turning everything off
		existingToedit = 'N';
		for (i=0;i<wfsArray.length;i++){
			var tmpON2 = "sH" + i;
			window[tmpON2].deactivate();
		}
	} else {
		//This is a double case, we want to enable the select and highlight functions
		if (element == 'Check' && selectOn == 'Y'){
			for (i=0;i<wfsArray.length;i++){
				var tmpON2 = "sH" + i;
				if (window[tmpON2].active == null){
					if (window["overlay" + i].visibility == true){
						window[tmpON2].activate();
					}
				} else if (window[tmpON2].active == false){
					if (window["overlay" + i].visibility == true){
						window[tmpON2].activate();
					}
				} else {
					if (window[tmpON2] == true && window["overlay" + i].visibility == false){
						//In this scenario we should turn off the section tool
						window[tmpON2].deactivate();
					}
				}
			}
		} else if (element != 'Check'){
			existingToedit = 'N';
			for (i=0;i<wfsArray.length;i++){
				var tmpON2 = "sH" + i;
				if (window[tmpON2].active == null){
					if (window["overlay" + i].visibility == true){
						window[tmpON2].activate();
					}
				} else if (window[tmpON2].active == false){
					if (window["overlay" + i].visibility == true){
						window[tmpON2].activate();
					}
				} else {
					window[tmpON2].deactivate();
				}
			}
		}
	}
	//This quick loop dectects if there is an active selection tool
	selectOn = 'N';
	for (i=0;i<wfsArray.length;i++){
		var tmpON2 = "sH" + i;
		if (window[tmpON2].active == true){
			selectOn = 'Y';
		}
	}
}

function edtoggleControl3(element) {
	for(key in controls3) {
		var control = controls3[key];
		if(element == key) {
			control.activate();
		} else {
			if (control.active == null) {
				control.activate();
				control.deactivate();
			} else {
				control.deactivate();
			}
		}
	}
}

function edMOst() {
	accordion.items.itemAt(5).expand();
	//Toggle the main tools to nav to avoid annoyance
	edMO(3, ET3);
}

function isNumber(n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
}

function edMO(type, number) {
	if (type == 1){
		//Rollover
		var imageURL = "../../apps/functions/drawingtypes" + number + ".png";
		document.getElementById('edMOimg').src = imageURL;
		if (number == 1) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Point</font></b>";
		} else if (number == 2) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Line</font></b>";
		} else if (number == 3) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Polygon</font></b>";
		} else if (number == 4) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Shape</font></b>";
		}
		
	} else if(type == 2) {
		//Rollover with selection
		if (number == 0) {
			number = ET2;
		}
		if (number == 1) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Point</font></b>";
			document.getElementById('shapeoptions').style.display = "none";
			document.getElementById('shapeoptions').style.visibility = "hidden";
			document.getElementById('shapesides').style.display = "none";
			document.getElementById('shapesides').style.visibility = "hidden";
			ET = 1;
			ET2 = 1;
			edMO(3, ET3);
		}
		if (number == 2) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Line</font></b>";
			document.getElementById('shapeoptions').style.display = "none";
			document.getElementById('shapeoptions').style.visibility = "hidden";
			document.getElementById('shapesides').style.display = "none";
			document.getElementById('shapesides').style.visibility = "hidden";
			ET = 2;
			ET2 = 2;
			edMO(3, ET3);
		}
		if (number == 3) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Polygon</font></b>";
			document.getElementById('shapeoptions').style.display = "none";
			document.getElementById('shapeoptions').style.visibility = "hidden";
			document.getElementById('shapesides').style.display = "none";
			document.getElementById('shapesides').style.visibility = "hidden";
			ET = 3;
			ET2 = 3;
			edMO(3, ET3);
		}
		if (number == 4) {
			document.getElementById('currentMode').innerHTML = "<b><font size=\"6\" color=\"#000080\">Shape</font></b>";
			document.getElementById('shapeoptions').style.display = "block";
			document.getElementById('shapeoptions').style.visibility = "visible";
			document.getElementById('shapesides').style.display = "block";
			document.getElementById('shapesides').style.visibility = "visible";
			controls.draw4.handler.sides = 3;
			ET = 4;
			ET2 = 4;
			edMO(3, ET3);
		}
		if (number == 9){
			//This is a special option to toggle the irregular option
			if (controls.draw4.handler.irregular == true) {
				controls.draw4.handler.irregular = false;
			} else {
				controls.draw4.handler.irregular = true;
			}
		}
		if (number == 10){
			//This is a special option to change the number of sides
			var sideNo = document.getElementById('sideNoInput').value;
			if (isNumber(sideNo) == true) {
				controls.draw4.handler.sides = sideNo;
			} else {
				alert('Please specify the number of sides as an number');
			}
		}
		
		//Now do the rollover
		var imageURL = "../../apps/functions/drawingtypes" + ET2 + ".png";
		document.getElementById('edMOimg').src = imageURL;
	} else {
		//This type of call means we are looking to toggle the tools
		var toolName, tn2;
		var tn1 = [];
		tn1.push('');
		tn1.push('Point');
		tn1.push('Line');
		tn1.push('Polygon');
		tn1.push('Shape');
		
		if (number == 0) {
			//This is the blank option (default)
			ET4 = 0;
			tn2 = "Edit Tools";
			handleTog(tn2, 'none');
			edMO(3,100);
			ET3 = 0;
			var elements = document.getElementsByName('edfunc');
			var len = elements.length;

			for (i=0; i<len; ++i){
				if (elements[i].value == 'none'){
					elements[i].checked = true;
				} else {
					elements[i].checked = false;
				}
			}	
		}
		if (number == 1) {
			ET4 = 0;
			toolName = "draw" + ET;
			edtoggleControl(toolName);
			tn2 = "Add a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 1;
		}
		if (number == 2) {
			ET4 = 1;
			//Turn on highlight before select
			edtoggleControl3("highlight");
			edtoggleControl2("sC");
			tn2 = "Transfer an existing record to the edits";
			handleTog(tn2, 'none');
			ET3 = 2;
			edMO(3,102);
		}
		//There is no need to select a record to edit, you have to do this anyway
		/*if (number == 3) {
		}*/
		if (number == 5) {
			ET4 = 0;
			toolName = "edit_reshape" + ET;
			edtoggleControl(toolName);
			tn2 = "Reshape a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 5;
		}
		if (number == 7) {
			ET4 = 0;
			toolName = "edit_resize" + ET;
			edtoggleControl(toolName);
			tn2 = "Resize a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 7;
		}
		if (number == 4) {
			ET4 = 0;
			toolName = "edit_drag" + ET;
			edtoggleControl(toolName);
			tn2 = "Move a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 4;
		}
		if (number == 6) {
			ET4 = 0;
			toolName = "edit_rotate" + ET;
			edtoggleControl(toolName);
			tn2 = "Rotate a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 6;
		}
		if (number == 8) {
			ET4 = 0;
			toolName = "del" + ET;
			edtoggleControl(toolName);
			tn2 = "Delete a " + tn1[ET];
			handleTog(tn2, 'none');
			edMO(3,101);
			ET3 = 8;
		}
		if (number == 99) {
			//This toggles the highlighter
			ET4 = 0;
			toolName = "highlight";
			edtoggleControl3(toolName);
			edtoggleControl2('sC');
			tn2 = "Select a Feature";
			handleTog(tn2, 'none');
		}
		if (number == 100) {
			//Switch off the all tools
			edtoggleControl('none');
			//edtoggleControl2('none'); No longer controlled here
			edtoggleControl3('none');
		}
		if (number == 101) {
			//Switch off the selection tools
			//edtoggleControl2('none'); No longer controlled here
			edtoggleControl3('none');
		}
		if (number == 102) {
			//Switch off the edit tools
			edtoggleControl('none');
		}
	}
}

function navFake(){
	//This is a fake function, the button doesn't do anything because nav is always active
}

function tranferit(evt) {
	//This function only runs if we are transferring to editable (ET4 variable defines this)
	if (ET4 == 1) {
		var cDT = new Date();
				
		//Get timezone
		var TZ = cDT.toUTCString(); 
		TZ = TZ.substring(TZ.length-3);
		
		//Pad the numbers below 10
		var MDT = cDT.getMonth()+1;
		if (MDT < 10) {
			MDT = '0' + MDT;
		} 
		var DDT = cDT.getDate();
		if (DDT < 10) {
			DDT = '0' + DDT;
		}
		var HDT = cDT.getHours();
		if (HDT < 10) {
			HDT = '0' + HDT;
		}
		var MmDT = cDT.getMinutes();
		if (MmDT < 10) {
			MmDT = '0' + MmDT;
		}
		var SDT = cDT.getSeconds();
		if (SDT < 10) {
			SDT = '0' + SDT;
		}
		
		//Create a postgres safe datetimestamp
		var currentDT = cDT.getFullYear() + '-' + MDT + '-' + DDT + 'T' + HDT + ':' + MmDT + ':' + SDT + TZ;
	
		var selectedGID = evt.feature.attributes.gid;
		var selectedGeometry = evt.feature.geometry;
		var GeomType;
		var VertNo = selectedGeometry.getVertices().length;
		var areaVal = selectedGeometry.getArea();
		if (areaVal > 0) {
			GeomType = "Polygon";
		} else if (VertNo > 2) {
			GeomType = "Line";
		} else {
			GeomType = "Point";
		}
		
		var newGeom = selectedGeometry;
		var attributes = {
			sid: session_id,
			savedatetime: currentDT,			
			editrec: selectedGID
		};
		var newFeature = new OpenLayers.Feature.Vector(newGeom, attributes); 
		newFeature.state = OpenLayers.State.INSERT;
		
		if (GeomType == "Point") {
			pointLayer.addFeatures([newFeature]);
			poiSaveStrategy.save(newFeature);
			pointLayer.refresh({force:true});
			edMO(2, 1);
		}
		
		if (GeomType == "Line") {
			lineLayer.addFeatures([newFeature]);
			linSaveStrategy.save(newFeature);
			lineLayer.refresh({force:true});
			edMO(2, 2);
		}
		
		if (GeomType == "Polygon") {
			simplePolygonLayer.addFeatures([newFeature]);
			sPolSaveStrategy.save(newFeature);
			simplePolygonLayer.refresh({force:true});
			edMO(2, 3);
		}
	}
}

function loadManual(){
	if (loadEdits == 'True' || loadEdits == 'TRUE' || loadEdits == 'Yes' || loadEdits == 'YES') {
		window.open('../../manual/index.html','1358938114413','width=1000px,height=630,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
	} else {
		window.open('../../manual/index-small.html','1358938114413','width=1000px,height=630,toolbar=0,menubar=0,location=0,status=1,scrollbars=1,resizable=1,left=0,top=0');
	}
}

function changeActTable(tableName){
    //Sets the table variable allowing the user to choose which table to edit
	table = tableName;
}

function thissticks() {
    //This stops the system defaulting to node after each edit
    if (stickyvalue != 0) {
        //Sticky mode is on so we turn it off
        document.getElementById('stickymode').value = 'Sticky Mode On';
        stickyvalue = 0;
    } else {
        //Sticky mode is off so we turn it on
        document.getElementById('stickymode').value = 'Sticky Mode Off';
        stickyvalue = 1;
    }
}

var preventingLoops = 'No';
function legendHandler(node, state){
	/*Example node attributes
	({text:"New bluetooth without existing infrastructure", leaf:true, checked:true, expanded:false, 
	icon:"https://geo.reading-travelinfo.co.uk/geoserver/wms?REQUEST=GetLegendGraphic&VERSION=1.0.0&FORMAT=
	image/png&WIDTH=20&HEIGHT=20&LAYER=Client:itsprojects&RULE=New bluetooth without existing infrastructure__POINT", 
	layer:"wfs0", ftype:"==", fproperty:"iconcls", fvalue:"New bluetooth without existing infrastructure__POINT", 
	loader:{baseParams:{}, dataUrl:(void 0), requestMethod:(void 0), events:{loadexception:true, load:true, beforeload:true}}, 
	id:"xnode-65"})*/
	if (preventingLoops=='No'){
		var layernum, flayer, fchildren, ftype, fproperty, fvalue;
		var lfilter, lfilterLen, filterDone, filterNull;
		flayer = node.attributes.layer;
		layernum = flayer.replace("wfs",""); 
		layernum = parseInt(layernum);
		ftype = node.attributes.ftype;
		lfilter = legendFilters[layernum];
		if (lfilter.layer!=flayer){
			//We have the wrong filter array
			var SuccessI = 0;
			for (i=0;i<legendFilters.length;i++){
				if (legendFilters[i].layer==flayer){
					lfilter = legendFilters[i];
					SuccessI = 1;
				}
			}
			if (SuccessI == 0){
				alert("An error has occurred with the map definitions, please contact the GIS server support team.");
				return;
			}
		}
		lfilter = lfilter.filter;
		filterNull = 'N';
		filterDone = 'N';
		var diplayParent = 'N';
		var tmpObjF;
		if (ftype!='layerSwitch'){
			//This is an individual node
			fproperty = node.attributes.fproperty;
			fvalue = node.attributes.fvalue;
			tmpObjF = new OpenLayers.Filter.Comparison({
				type: ftype,
				property: fproperty,
				value: fvalue
			});
			if (typeof lfilter.filters=='undefined' && lfilter.property==''){
				//This must be the first run as the filter is currently set to default
				if (state=='checked'){
					//We want to display this case
					legendFilters[layernum].filter = tmpObjF;
					filterDone = 'Y';
					diplayParent = node.parentNode;
				} else {
					//Unchecking is not required in this case
					filterDone = 'Y';
				}
			} else {
				if (typeof lfilter.filters=='undefined'){
					//Single existing filter
					if (state=='checked'){
						//We want to display this case
						if (lfilter.property == fproperty && lfilter.value == fvalue){
							//If it is the same then we don't need to change the filter
							filterDone = 'Y';
						} else {
							//We need to add a filter
							legendFilters[layernum].filter = new OpenLayers.Filter.Logical({
								type: '||',
								filters: [lfilter, tmpObjF]
							});
							filterDone = 'Y';
						}
					} else {
						if (lfilter.property == fproperty && lfilter.value == fvalue){
							//We are turning off this filter
							legendFilters[layernum].filter = new OpenLayers.Filter.Comparison({
								type: '',
								property: '',
								value: ''
							});
							filterNull = node.parentNode;
							filterDone = 'Y';
						} else {
							//Must be a mistake, no need to do anything
							filterDone = 'Y';
						}
					}
				} else {
					//Multiple exisitng filters
					lfilterLen = lfilter.filters.length; //How many filters

					var tmpObjFA = [];
					for (i=0;i<lfilterLen;i++){
						tmpObjFA.push(lfilter.filters[i]);
					}
					for (i=0;i<lfilterLen;i++){
						//Loop through the filters
						if (filterDone != 'Y'){
							if(lfilter.filters[i].property == fproperty && lfilter.filters[i].value == fvalue){
								//This filter already exists
								if (state=='checked'){
									//do nothing
									filterDone = 'Y';
								} else {
									//remove it
									legendFilters[layernum].filter.filters = [];
									if (lfilterLen==1){
										//There is only one record so we shouldn't really be here; reset the filter
										legendFilters[layernum].filter = new OpenLayers.Filter.Comparison({
											type: '',
											property: '',
											value: ''
										});
										filterNull = node.parentNode;
										filterDone = 'Y';
									} else {
										for (i2=0;i2<lfilterLen;i2++){
											if (i2!=i){
												legendFilters[layernum].filter.filters.push(tmpObjFA[i2]);
											}
										}
										if (legendFilters[layernum].filter.filters.length > 1){
											filterDone = 'Y';
										} else {
											//We are back to a single filter, remove the logical
											legendFilters[layernum].filter = legendFilters[layernum].filter.filters[0];
											filterDone = 'Y';
										}
									}
								}
							} 
						}
					}
					if (filterDone=='N' && state=='checked'){
						//OK, we did not find the filter in the object so lets add it
						legendFilters[layernum].filter.filters.push(tmpObjF);
						filterDone = 'Y';
					} else {
						//If we are turning off but can't find the filter then we need do nothing
						filterDone = 'Y';
					}
				}
			}
		} else {
			//This is a whole layer!
			fchildren = node.attributes.children;
			if (typeof lfilter.filters=='undefined' && lfilter.property=='' && state=='checked'){
				//Turning on the whole layer
				legendFilters[layernum].filter = new OpenLayers.Filter.Logical({
					type: '||',
					filters: []
				});
				for (i=0;i<fchildren.length;i++){
					fproperty = fchildren[i].fproperty;
					fvalue = fchildren[i].fvalue;
					tmpObjF = new OpenLayers.Filter.Comparison({
						type: '==',
						property: fproperty,
						value: fvalue
					});
					legendFilters[layernum].filter.filters.push(tmpObjF);
				}
				node.eachChild(function(n) {
					preventingLoops = 'Yes';
					n.getUI().toggleCheck(true);
					preventingLoops = 'No';
				});
				var layerSw = "overlay" + layernum;
				window[layerSw].setVisibility(true) ;
				filterDone = 'Y';
			} else {
				if (state =='checked'){
					//Keep the existing filter but turn on the layer
					var layerSw = "overlay" + layernum;
					window[layerSw].setVisibility(true) ;
					filterDone = 'Y';
				} else {
					if (typeof lfilter.filters!='undefined'){
						if (lfilter.filters.length == fchildren.length){
							//All the nodes are selected so we turn all off
							legendFilters[layernum].filter = new OpenLayers.Filter.Comparison({
								type: '',
								property: '',
								value: ''
							});
							filterNull = 'Y';
							preventingLoops = 'Yes';
							node.eachChild(function(n) {
								n.getUI().toggleCheck(false);
							});
							preventingLoops = 'No';
							var layerSw = "overlay" + layernum;
							window[layerSw].setVisibility(false) ;
							filterDone = 'Y';
						} else {
							//Keep the existing filter but turn off the layer
							var layerSw = "overlay" + layernum;
							window[layerSw].setVisibility(false) ;
							filterDone = 'Y';
						}
					} else {
						//Keep the existing filter but turn off the layer
						var layerSw = "overlay" + layernum;
						window[layerSw].setVisibility(false) ;
						filterDone = 'Y';
					}
				}
			}
		}
		
		if (filterDone == 'Y'){
			//OK, we have now updated the filter and turned layers on and off, next we must update the layer filter by merging this filter with the user filter
			var layerSw = "overlay" + layernum; //This is the overlay to update
			var wfsSw = "wfs" + layernum; //This is the corresponding WFS layer
			var layfilter = legendFilters[layernum].filter;
			var usfilter = userFilters[layernum].filter;
			var filterParams = {
				filter: null
			};

			if (typeof layfilter.filters=='undefined' && layfilter.property==''){
				//No layer filter
				if (typeof usfilter.filters=='undefined' && usfilter.property==''){
					//No user filter
					window[layerSw].mergeNewParams(filterParams); //Update the WMS
					window[wfsSw].filter = null; //Update the wfs
				} else {
				//No layer filter but there is a user filter
					//Update the WMS
					try {
						filterParams.filter = xml.write(filter_1_1.write(userFilters[layernum].filter)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams); 
					
					window[wfsSw].filter = userFilters[layernum].filter; //Update the wfs
				}
			} else {
				//There is a layer filter
				if (typeof usfilter.filters=='undefined' && usfilter.property==''){
				//No user filter
					//Update the WMS
					try {
						filterParams.filter = xml.write(filter_1_1.write(legendFilters[layernum].filter)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams); 
					
					window[wfsSw].filter = legendFilters[layernum].filter; //Update the wfs
				} else {
				//Both filters apply
					//Update the WMS
					var tmpFL = new OpenLayers.Filter.Logical({
						type: '&&',
						filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
					});	
					try {
						filterParams.filter = xml.write(filter_1_1.write(tmpFL)); 
					} catch (err) {
						alert(err.message);
					}
					window[layerSw].mergeNewParams(filterParams);
					
					//Update the wfs
					window[wfsSw].filter = new OpenLayers.Filter.Logical({
						type: '&&',
						filters: [legendFilters[layernum].filter, userFilters[layernum].filter]
					});	
				}
			}
			
			window[layerSw].redraw();
			window[wfsSw].refresh({force: true});
			if (filterNull != 'N' && filterNull != 'Y'){
				//We have turned everything off, better switch off the parent
				filterNull.getUI().toggleCheck(false);
			}
			if (diplayParent != 'N'){
				//Turning on the parent
				diplayParent.getUI().toggleCheck(true);
			}
		}
	}
}

/* Not used

function mouseMover(event){
	//OK where is the mouse centre?
	var tmpX = map.getLonLatFromPixel(event.xy).lon;
	var tmpY = map.getLonLatFromPixel(event.xy).lat;
	var tmpGeom = new OpenLayers.Geometry.Point(tmpX, tmpY);
	
	//We need a tolerance factor so lets get the current zoom
	zoomLev = map.getZoom();  //Current zoom level
	curPower = Scalefactor * curPower1;
	curPower = curPower * zoomLev;
	curPower = Math.pow(2.71828183, curPower);
	currLev = curve * curPower;  //This calculates the size of 1m based on the calculated curve (number is natural log)
	
	//Multiply by the required number of metres
	currLev = currLev * 5;
	//alert(currLev);
	
	var SpFilter = new OpenLayers.Filter.Spatial({
		type: OpenLayers.Filter.Spatial.DWITHIN,
		value: tmpGeom,
		//distance: currLev, 
		distance: 50, 
		distanceUnits: 'm'
	});
	
	//Finally for each layer, lets bring in the WFS records
	for (i=0;i<wfsArray.length;i++){
		if (typeof window[wfsArray[i]].visibility != 'undefined'){
			if (window[wfsArray[i]].visibility == true){
				window[wfsArray[i]].filter = SpFilter;
				window[wfsArray[i]].refresh({force: true});
			}
		}
	}
}

var lastTime = new Date();
lastTime = lastTime.getTime();
var lastMonitor = 0;
function callControl(eventMonitor, thisTime, event) {
	if (eventMonitor == 0){
		mouseMover(event);
	} else {
		if (lastTime != thisTime && lastMonitor == eventMonitor){
			mouseMover(event);
			lastMonitor = eventMonitor;
			lastTime = thisTime;
		} else {
			lastMonitor = eventMonitor;
			lastTime = thisTime;
		}
	}
}*/
