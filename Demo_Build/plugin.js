$(document).ready(function(){
	/** 
	This segment of the code runs when the check button on the basic configuration page is clicked.
	*/
	$('#check').click(function(){
		/**
		If the OS is Windows, it has unique set of steps to be followed by the user
		*/
		if (navigator.userAgent.indexOf("Windows") != -1) {
			/**
			Variable for flash plugins
			*/
			var hasFlash = false;
			try {
				/**
				Flash from ActiveX Object
				*/
				var fo = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
				if (fo) {
					hasFlash = true;
				}
			} catch (e) {
							/**
							Flash from Installed Plugins
							*/
							if (navigator.mimeTypes
							&& navigator.mimeTypes['application/x-shockwave-flash'] != undefined
							&& navigator.mimeTypes['application/x-shockwave-flash'].enabledPlugin) {
							hasFlash = true;
							}
					}
		/**
		The div where the text specific to the client's configuration gets added
		*/
		var div = document.getElementById('requirements-win');
		
		/**
		If both Flash and Java are not present
		*/
		if (!hasFlash && !deployJava.versionCheck("1.6.0+")){
				$('#requirements-win').show();
				$('#jf').show();
		}
		/**
		If Only Java is not present
		*/
		else if (!deployJava.versionCheck("1.6.0+")){
				$('#requirements-win').show();
				$('#j').show();
		}
		/**
		If Only Flash is not present
		*/
		else if (!hasFlash){
				$('#requirements-win').show();
				$('#f').show();
		}
		/**
		If all the plugins are present
		*/
		else{
			$('#req-config').show();
			
		}
		$( '#check-div' ).detach();
	}
	/**
	If the OS is Linux, it has unique set of steps to be followed by the user and the a separate process that the js file does
	*/
	else{
		// screen
		var screenSize = '';
		var width, height;
		if (screen.width) {
			width = (screen.width) ? screen.width : '';
			height = (screen.height) ? screen.height : '';
			screenSize += '' + width + " x " + height;
		}

		/**
		This segment of the JS identifies the type of browser the user is using
		*/
		//browser
		var nVer = navigator.appVersion;
		var nAgt = navigator.userAgent;
		var browser = navigator.appName;
		var version = '' + parseFloat(navigator.appVersion);
		var majorVersion = parseInt(navigator.appVersion, 10);
		var nameOffset, verOffset, ix;

		// Opera
		if ((verOffset = nAgt.indexOf('Opera')) != -1) {
			browser = 'Opera';
			version = nAgt.substring(verOffset + 6);
			if ((verOffset = nAgt.indexOf('Version')) != -1) {
				version = nAgt.substring(verOffset + 8);
			}
		}
		// MSIE
		else if ((verOffset = nAgt.indexOf('MSIE')) != -1) {
			browser = 'Microsoft Internet Explorer';
			version = nAgt.substring(verOffset + 5);
		}

		/**
		IE 11 no longer identifies itself as MS IE, so trap it
		http://stackoverflow.com/questions/17907445/how-to-detect-ie11
		*/
		else if ((browser == 'Netscape') && (nAgt.indexOf('Trident/') != -1)) {
			browser = 'Microsoft Internet Explorer';
			version = nAgt.substring(verOffset + 5);
			if ((verOffset = nAgt.indexOf('rv:')) != -1) {
				version = nAgt.substring(verOffset + 3);
			}

		}

		// Chrome
		else if ((verOffset = nAgt.indexOf('Chrome')) != -1) {
			browser = 'Chrome';
			version = nAgt.substring(verOffset + 7);
		}
		// Safari
		else if ((verOffset = nAgt.indexOf('Safari')) != -1) {
			browser = 'Safari';
			version = nAgt.substring(verOffset + 7);
			if ((verOffset = nAgt.indexOf('Version')) != -1) {
				version = nAgt.substring(verOffset + 8);
			}

			/** Chrome on iPad identifies itself as Safari. Actual results do not match what Google claims
			at: https://developers.google.com/chrome/mobile/docs/user-agent?hl=ja
			No mention of chrome in the user agent string. However it does mention CriOS, which presumably
			can be keyed on to detect it.
			*/
			if (nAgt.indexOf('CriOS') != -1) {
				//Chrome on iPad spoofing Safari...correct it.
				browser = 'Chrome';
				//Don't believe there is a way to grab the accurate version number, so leaving that for now.
			}
		}
		// Firefox
		else if ((verOffset = nAgt.indexOf('Firefox')) != -1) {
			browser = 'Firefox';
			version = nAgt.substring(verOffset + 8);
		}
		// Other browsers
		else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) < (verOffset = nAgt.lastIndexOf('/'))) {
			browser = nAgt.substring(nameOffset, verOffset);
			version = nAgt.substring(verOffset + 1);
			if (browser.toLowerCase() == browser.toUpperCase()) {
				browser = navigator.appName;
			}
		}
    
		// trim the version string
		if ((ix = version.indexOf(';')) != -1) version = version.substring(0, ix);
		if ((ix = version.indexOf(' ')) != -1) version = version.substring(0, ix);
		if ((ix = version.indexOf(')')) != -1) version = version.substring(0, ix);

		majorVersion = parseInt('' + version, 10);
		if (isNaN(majorVersion)) {
			version = '' + parseFloat(navigator.appVersion);
			majorVersion = parseInt(navigator.appVersion, 10);
		}

		// mobile version
		var mobile = /Mobile|mini|Fennec|Android|iP(ad|od|hone)/.test(nVer);

		// cookie
		var cookieEnabled = !!(navigator.cookieEnabled);

		if (typeof navigator.cookieEnabled == 'undefined' && !cookieEnabled) {
			document.cookie = 'testcookie';
			cookieEnabled = (document.cookie.indexOf('testcookie') != -1);
		}
		/**
		This segment of the code identifies the type of Operating System the client is using
		*/
		// system
		var os = "unknown";
		/**
		The list of possible OS the client may use and the array from which the code compares from
		*/
		var clientStrings = [
			{s: 'Windows 3.11', r: /Win16/},
			{s: 'Windows 95', r: /(Windows 95|Win95|Windows_95)/},
			{s: 'Windows ME', r: /(Win 9x 4.90|Windows ME)/},
			{s: 'Windows 98', r: /(Windows 98|Win98)/},
			{s: 'Windows CE', r: /Windows CE/},
			{s: 'Windows 2000', r: /(Windows NT 5.0|Windows 2000)/},
			{s: 'Windows XP', r: /(Windows NT 5.1|Windows XP)/},
			{s: 'Windows Server 2003', r: /Windows NT 5.2/},
			{s: 'Windows Vista', r: /Windows NT 6.0/},
			{s: 'Windows 7', r: /(Windows 7|Windows NT 6.1)/},
			{s: 'Windows 8.1', r: /(Windows 8.1|Windows NT 6.3)/},
			{s: 'Windows 8', r: /(Windows 8|Windows NT 6.2)/},
			{s: 'Windows NT 4.0', r: /(Windows NT 4.0|WinNT4.0|WinNT|Windows NT)/},
			{s: 'Windows ME', r: /Windows ME/},
			{s: 'Android', r: /Android/},
			{s: 'Open BSD', r: /OpenBSD/},
			{s: 'Sun OS', r: /SunOS/},
			{s: 'Linux', r: /(Linux|X11)/},
			{s: 'iOS', r: /(iPhone|iPad|iPod)/},
			{s: 'Mac OS X', r: /Mac OS X/},
			{s: 'Mac OS', r: /(MacPPC|MacIntel|Mac_PowerPC|Macintosh)/},
			{s: 'QNX', r: /QNX/},
			{s: 'UNIX', r: /UNIX/},
			{s: 'BeOS', r: /BeOS/},
			{s: 'OS/2', r: /OS\/2/},
			{s: 'Search Bot', r: /(nuhk|Googlebot|Yammybot|Openbot|Slurp|MSNBot|Ask Jeeves\/Teoma|ia_archiver)/}
		];
		/**
		This loop checks the OS from the array which defines the list of Operating System
		*/
		for (var id in clientStrings) {
			var cs = clientStrings[id];
			if (cs.r.test(nAgt)) {
				os = cs.s;
				break;
			}
		}
	
		/**
		This segment of the JS identifies the version of OS the user is using
		*/
		var osVersion = "unknown";

		if (/Windows/.test(os)) {
			osVersion = /Windows (.*)/.exec(os)[1];
			os = 'Windows';
		}

		switch (os) {
			case 'Mac OS X':
				osVersion = /Mac OS X (10[\.\_\d]+)/.exec(nAgt)[1];
				break;

			case 'Android':
				osVersion = /Android ([\.\_\d]+)/.exec(nAgt)[1];
				break;

			case 'iOS':
				osVersion = /OS (\d+)_(\d+)_?(\d+)?/.exec(nVer);
				osVersion = osVersion[1] + '.' + osVersion[2] + '.' + (osVersion[3] | 0);
				break;

		}
		/**
		To check the Architecture of the System the Client uses
		*/
		var Architecture;
		if (navigator.userAgent.indexOf("WOW64") != -1 || navigator.userAgent.indexOf("Win64") != -1) {
			Architecture="Architecture :  64 bit OS";
		}
		else {
			Architecture="Architecture :  32 bit OS";
		}
		/** 
		Initialising a variable arr for storing the missing plugins that are required to run this experiment successfully
		*/
		var list="";
		/**
		This loop checks whether the required plugins are installed or not by string comparison between the array and the list Navigator Plugins List.
		*/
		//Navigator Plugin Checking
		var count =0;
		var arr="";
		var arrLines = ["Java Deploy","Flash","IcedTea"];
		for (var i = 0; i < arrLines.length; i++) {
			var temp = false;
			var curLine = arrLines[i];
			for (var j = 0; j < navigator.plugins.length; j++) {
				var plugin = navigator.plugins[j];
				var plugin_name = plugin.name;
				var n = plugin_name.search(curLine);
				if (n != -1) {
					temp = true;
					break;
				}
			}
			/**
			This if is true when a plugin required is not found in the list of installed plugins of the user's browser.
			*/
			if (temp == false) {
				switch(curLine){
					case 'Java Deploy':
					if(os!="Linux" && browser!="Chrome"){
						list+="jre\n";
						count++;
						arr+="Java(OpenJDK) ";
					}
					break;
					case 'Flash':
					list+="flash\n";
					count++;
					arr+="Flash ";
					break;
					case 'IcedTea': 
					if(os == "Linux" && browser!="Chrome"){
						list+="icedtea-\n";
						count++;
						arr+="Icedtea Plugin "
					}	
					break;
				}
			}
		}
		/**
		If the Java 3D checkbox is checked, the array for requirements.txt adds java3d\n
		*/
		if (document.getElementById('j3d-ubuntu').checked) {
           		 list+="java3d\n";
			 count++;
       		 }
		/**
		The div where the steps specific to the client's os gets added
		*/
		var div = document.getElementById('requirements-linux');
		/**
		The count is 0 when all the required plugins are present. It increments when even a single required plugin is not present
		*/
		if(count==0){
			$('#req-config').show();
		}
		else{
				$('#requirements-linux').show();
			}
		$( '#check-div' ).detach();		
	}
	/** 
	This segment of the code runs when the download button on the page is clicked.
	*/
	$('#download').click(function(e){
		$.generateFile({
			filename	: 'basic.txt',
			content		: list,
			script		: 'download.php'
		});
		e.preventDefault();
	});
	});	
});
