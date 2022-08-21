var pref_cache = {};
var option_cache = "";

let loading = document.getElementById("loading");
let main = document.getElementById("main");
let domain_selector = document.getElementById("domain_selector");
let delete_domain = document.getElementById("delete_domain");
let svg_table = document.getElementById("svg_table");
let original_svg = document.getElementById("original_svg");
let target_svg = document.getElementById("target_svg");
let original_text = document.getElementById("original_text");
let target_text = document.getElementById("target_text");

browser.storage.onChanged.addListener(load_domains);

delete_domain.onclick = () => {
	delete pref_cache[selectedDomain()];
	browser.storage.local.clear();
	browser.storage.local.set(pref_cache).then(load_domains);
}

domain_selector.onchange = load_SVGs;

function load_domains() {
	browser.storage.local.get(pref => {
		pref_cache = pref;
		if (domain_selector.options.length) option_cache = selectedDomain();
		domain_selector.innerHTML = null;
		let domains = Object.keys(pref);
		domains.forEach(domain => {
			let option = document.createElement("option");
			option.text = domain;
			domain_selector.add(option);
		});
		for (let i = 0; i < domain_selector.options.length; i++) {
			if (domain_selector.options[i].text === option_cache) {
				domain_selector.selectedIndex = i;
				break;
			}
		}
		load_SVGs();
	});
}

function load_SVGs() {
	clear_SVGs();
	let i = 0;
	let current_row = svg_table.insertRow();
	for (let SVGContent in pref_cache[selectedDomain()]) {
		let current_cell = current_row.insertCell();
		current_cell.innerHTML = `<svg>${SVGContent}</svg>`;
		current_cell.onclick = () => loadSVGToEditor(SVGContent);
		if (i++ == 7) {
			i = 0;
			current_row = svg_table.insertRow();
		}
	}
	autoScaleAllSVG();
}

function clear_SVGs() {
	svg_table.innerHTML = "";
}

function selectedDomain() {
	return domain_selector.options[domain_selector.selectedIndex].text;
}

function loadSVGToEditor(SVGContent) {
	original_svg.innerHTML = `<svg>${SVGContent}</svg>`;
	original_text.value = SVGContent;
	autoScaleSVG(original_svg.firstChild);
}

function autoScaleAllSVG() {
	let SVGCollection = document.getElementsByTagName("svg");
	for (let SVGElement of SVGCollection) {
		autoScaleSVG(SVGElement);
	}
}

/**
 * @author Nick Scialli
 * @param {SVGElement} SVG 
 */
function autoScaleSVG(SVG) {
	const { xMin, xMax, yMin, yMax } = [...SVG.children].reduce((dimension, el) => {
		try {
			const { x, y, width, height } = el.getBBox();
			if (!dimension.xMin || x < dimension.xMin) dimension.xMin = x;
			if (!dimension.xMax || x + width > dimension.xMax) dimension.xMax = x + width;
			if (!dimension.yMin || y < dimension.yMin) dimension.yMin = y;
			if (!dimension.yMax || y + height > dimension.yMax) dimension.yMax = y + height;
		} catch (error) {
			console.error("Can't get " + el.nodeName + "'s dimension");
		}
		return dimension;
	}, {
		xMin: 0,
		xMax: 0,
		yMin: 0,
		yMax: 0
	});
	let x = xMin;
	let y = yMin;
	let width = xMax - xMin;
	let height = yMax - yMin;
	if (width > height) {
		y = y - (width - height) / 2;
		height = width;
	} else {
		x = x - (height - width) / 2;
		width = height;
	}
	if (width === 0) width = height = 1;
	const viewbox = `${x} ${y} ${width} ${height}`;
	SVG.setAttribute('viewBox', viewbox);
}

load_domains();

/* //This script is shared by option page and popup

const default_reservedColor_cs = Object.freeze({
	"developer.mozilla.org": "IGNORE_THEME",
	"github.com": "IGNORE_THEME",
	"mail.google.com": "CLASS_wl",
	"open.spotify.com": "#000000",
	"www.bbc.com": "IGNORE_THEME",
	"www.instagram.com": "IGNORE_THEME",
	"www.spiegel.de": "IGNORE_THEME",
	"www.youtube.com": "IGNORE_THEME"
});

let body = document.getElementsByTagName("body")[0];
let loading = document.getElementById("loading");
let settings = document.getElementById("settings");
let color_scheme_light = document.getElementById("color_scheme_no_dark");
let color_scheme_dark = document.getElementById("color_scheme_no_light");
let color_scheme_system = document.getElementById("color_scheme_system");
let allow_dark_light = document.getElementById("force_mode");
let force_mode_caption = document.getElementById("force_mode_caption");
let dynamic = document.getElementById("dynamic");
let op_tabbar_color = document.getElementById("tabbar_color");
let op_toolbar_color = document.getElementById("toolbar_color");
let op_separator_opacity = document.getElementById("separator_opacity");
let op_popup_color = document.getElementById("popup_color");
let op_more_custom = document.getElementById("more_custom");
let op_custom_options = document.getElementById("custom_options");
let op_custom_options_table = document.getElementById("custom_options_table");
let op_light_color = document.getElementById("light_color");
let op_dark_color = document.getElementById("dark_color");
let op_reset_light = document.getElementById("reset_light_color");
let op_reset_dark = document.getElementById("reset_dark_color");
let op_reset_all = document.getElementById("reset_all");
let op_save = document.getElementById("save");
let op_add = document.getElementById("add");
let pp_more_custom = document.getElementById("custom_popup");
let pp_info_display = document.getElementById("info_display");

//Settings cache
var pref_scheme;
var pref_force;
var pref_dynamic;
var pref_tabbar_color;
var pref_toolbar_color;
var pref_popup_color;
var pref_custom;
var pref_light_home_color;
var pref_dark_home_color;
var pref_reservedColor_cs; */

/**
 * Loads preferences into cache.
 */
/* function loadPref(pref) {
	pref_scheme = pref.scheme;
	pref_force = pref.force;
	pref_dynamic = pref.dynamic;
	pref_tabbar_color = pref.tabbar_color;
	pref_toolbar_color = pref.toolbar_color;
	pref_popup_color = pref.popup_color;
	pref_separator_opacity = pref.separator_opacity;
	pref_custom = pref.custom;
	pref_light_home_color = pref.light_color;
	pref_dark_home_color = pref.dark_color;
	pref_reservedColor_cs = pref.reservedColor_cs;
	return true;
} */

/**
 * @returns If all prefs are loaded.
 */
/* function verifyPref() {
	return pref_scheme != null
		&& pref_force != null
		&& pref_tabbar_color != null
		&& pref_toolbar_color != null
		&& pref_popup_color != null
		&& pref_separator_opacity != null
		&& pref_custom != null
		&& pref_light_home_color != null
		&& pref_dark_home_color != null
		&& pref_reservedColor_cs != null;
} */

/* settings.hidden = true;
loading.hidden = false;

load();

browser.theme.onUpdated.addListener(autoPageColor);
//Load prefs when popup is opened
document.addEventListener("pageshow", load);
//Sync prefs on option page and popup
browser.storage.onChanged.addListener(load_lite); */

/**
 * Loads all prefs
 */
/* function load() {
	browser.storage.local.get(pref => {
		if (loadPref(pref) && verifyPref()) {
			allow_dark_light.checked = !pref_force;
			dynamic.checked = pref_dynamic;
			color_scheme_dark.checked = pref_scheme == "dark";
			color_scheme_light.checked = pref_scheme == "light";
			color_scheme_system.checked = pref_scheme == "system";
			if (!popupDetected()) { //when the script is run by option page
				op_tabbar_color.value = pref_tabbar_color;
				op_toolbar_color.value = pref_toolbar_color;
				op_popup_color.value = pref_popup_color;
				op_separator_opacity.value = pref_separator_opacity;
				op_more_custom.checked = pref_custom;
				op_custom_options.hidden = !pref_custom;
				op_light_color.value = pref_light_home_color;
				op_dark_color.value = pref_dark_home_color;
				let table_rows = op_custom_options_table.rows;
				for (let i = table_rows.length - 1; i > 1; i--)
					op_custom_options_table.deleteRow(i);
				let domains = Object.keys(pref_reservedColor_cs);
				domains.forEach((domain, i) => {
					let new_row = op_custom_options_table.insertRow(i + 2);
					new_row.innerHTML += generateNewRow(domain, i);
					addAction(i);
				});
			}
			autoPageColor();
			loading.hidden = true;
			settings.hidden = false;
			applySettings();
		}
	});
} */

/**
 * Only loads color scheme, force mode, dynamic mode
 */
/* function load_lite() {
	browser.storage.local.get(pref => {
		if (loadPref(pref) && verifyPref()) {
			allow_dark_light.checked = !pref_force;
			dynamic.checked = pref_dynamic;
			color_scheme_dark.checked = pref_scheme == "dark";
			color_scheme_light.checked = pref_scheme == "light";
			color_scheme_system.checked = pref_scheme == "system";
			autoPageColor();
			loading.hidden = true;
			settings.hidden = false;
			applySettings();
		}
	});
}

color_scheme_dark.addEventListener("input", () => {
	if (color_scheme_dark.checked) {
		color_scheme_light.checked = false;
		color_scheme_system.checked = false;
		changeColorScheme("dark");
	}
});

color_scheme_light.addEventListener("input", () => {
	if (color_scheme_light.checked) {
		color_scheme_dark.checked = false;
		color_scheme_system.checked = false;
		changeColorScheme("light");
	}
});

color_scheme_system.addEventListener("input", () => {
	if (color_scheme_system.checked) {
		color_scheme_dark.checked = false;
		color_scheme_light.checked = false;
		changeColorScheme("system");
	}
});
 */
/**
 * Sets the color scheme, and updates appearance of option page.
 *
 * @param {*} pending_scheme the name of the scheme to change to.
 */
/* function changeColorScheme(pending_scheme) {
	pref_scheme = pending_scheme;
	browser.storage.local.set({ scheme: pending_scheme });
	if (firefoxAboveV95()) browser.browserSettings.overrideContentColorScheme.set({ value: pending_scheme });
	autoPageColor();
} */

//If it's below v95.0, grey out "allow..." option
/* if (!firefoxAboveV95()) {
	allow_dark_light.checked = false;
	allow_dark_light.disabled = true;
} else {
	allow_dark_light.onclick = () => {
		if (allow_dark_light.checked) {
			browser.storage.local.set({ force: false });
		} else {
			browser.storage.local.set({ force: true });
		}
	};
}

dynamic.onclick = () => {
	if (dynamic.checked) {
		browser.storage.local.set({ dynamic: true });
	} else {
		browser.storage.local.set({ dynamic: false });
	}
}; */

/**
 * Gives newly generated HTML elements actions.
 * 
 * @param {number} i The index number given to newly generated HTML elements.
 */
/* function addAction(i) {
	let domain_field = document.getElementById(`DOM_${i}`);
	let select_menu = document.getElementById(`SEL_${i}`);
	let operation = document.getElementById(`OPE_${i}`);
	let delete_button = document.getElementById(`DEL_${i}`);
	domain_field.oninput = autoSaveSettings;
	select_menu.onchange = () => {
		switch (select_menu.selectedIndex) {
			case 0: operation.innerHTML = `<input type="color" class="FiveEm" value="#FFFFFF">`; break;
			case 1: operation.innerHTML = `<span class="FiveEm"></span>`; break;
			case 2: operation.innerHTML = `<input type="text" class="FiveEm" value="">`; break;
			case 3: operation.innerHTML = `<input type="text" class="FiveEm" value="">`; break;
			default: break;
		}
		autoSaveSettings();
	};
	delete_button.onclick = () => {
		delete_button.parentElement.parentElement.remove();
		autoSaveSettings();
	};
	operation.oninput = autoSaveSettings;
} */


/**
 * Reads lookup table and stores data in storage.
 */
/* function autoSaveSettings() {
	let pending_reservedColor_cs = {};
	let all_table_rows = op_custom_options_table.firstElementChild.children;
	for (let i = 2; i < all_table_rows.length; i++) {
		let table_cells = all_table_rows[i].children;
		let domain = table_cells[0].firstElementChild.value;
		if (domain != "" && isNaN(domain) && pending_reservedColor_cs[domain] == null) {
			let action;
			switch (table_cells[1].firstElementChild.selectedIndex) {
				case 0: action = table_cells[2].firstElementChild.value; break;
				case 1: action = "IGNORE_THEME"; break;
				case 2: action = `CLASS_${table_cells[2].firstElementChild.value}`; break;
				case 3: action = `TAG_${table_cells[2].firstElementChild.value}`; break;
				default: break;
			}
			pending_reservedColor_cs[domain] = action;
			if (table_cells[4] != null) table_cells[4].remove();
		} else {
			if (table_cells[4] == null) all_table_rows[i].insertCell().innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>`;
		}
	}
	browser.storage.local.set({ reservedColor_cs: pending_reservedColor_cs });
} */

/**
 * Reads settings for a domain, generates new HTML elements and gives them id-s.
 * These HTML elements shall be inserted into op_custom_options_table using insertRow().
 * Shall run addAction() after inserting.
 * 
 * @param {*} domain Domain stored in the storage.
 * @param {*} i Special numbering of the elements.
 * @returns 
 */
/* function generateNewRow(domain, i) {
	let action = "#ECECEC"; //default action for new settings row
	if (action == null) return null;
	domain == "" ? domain = "example.com" : action = pref_reservedColor_cs[domain];
	let part_1 = `<input id="DOM_${i}" type="text" value="${domain}">`;
	let part_2, part_3;
	let part_4 = `<button id="DEL_${i}" title="Delete"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg></button>`;
	if (action == "IGNORE_THEME") {
		part_2 = `<select id="SEL_${i}"><option>specify a color</option><option selected>ignore theme color</option><option>pick from class</option><option>pick from tag</option><option>pick from id</option><option>pick from name</option></select>`;
		part_3 = `<span class="FiveEm"></span>`;
	} else if (action.startsWith("TAG_")) {
		part_2 = `<select id="SEL_${i}"><option>specify a color</option><option>ignore theme color</option><option>pick from class</option><option selected>pick from tag</option><option>pick from id</option><option>pick from name</option></select>`;
		part_3 = `<input type="text" class="FiveEm" value="${action.replace("TAG_", "")}">`;
	} else if (action.startsWith("CLASS_")) {
		part_2 = `<select id="SEL_${i}"><option>specify a color</option><option>ignore theme color</option><option selected>pick from class</option><option>pick from tag</option><option>pick from id</option><option>pick from name</option></select>`;
		part_3 = `<input type="text" class="FiveEm" value="${action.replace("CLASS_", "")}">`;
	} else if (action.startsWith("ID_")) {
		part_2 = `<select id="SEL_${i}"><option>specify a color</option><option>ignore theme color</option><option>pick from class</option><option>pick from tag</option><option selected>pick from id</option><option>pick from name</option></select>`;
		part_3 = `<input type="text" class="FiveEm" value="${action.replace("ID_", "")}">`;
	} else if (action.startsWith("NAME_")) {
		part_2 = `<select id="SEL_${i}"><option>specify a color</option><option>ignore theme color</option><option>pick from class</option><option>pick from tag</option><option>pick from id</option><option selected>pick from name</option></select>`;
		part_3 = `<input type="text" class="FiveEm" value="${action.replace("NAME_", "")}">`;
	} else {
		part_2 = `<select id="SEL_${i}"><option selected>specify a color</option><option>ignore theme color</option><option>pick from class</option><option>pick from tag</option><option>pick from id</option><option>pick from name</option></select>`;
		part_3 = `<input type="color" class="FiveEm" value="${action}">`;
	}
	return `<td class="TenEm">${part_1}</td><td>${part_2}</td><td id="OPE_${i}">${part_3}</td><td>${part_4}</td>`;
} */

/**
 * Triggers color update
 */
/* function applySettings() {
	browser.runtime.sendMessage("UPDATE_REQUEST");
} */

/**
 * Updates color of option page or popup
 */
/* function autoPageColor() {
	popupDetected() ? autoPopupColor() : autoOptionsColor();
} */

/**
 * Updates popup's color depends on tab bar color.
 */
/* function autoPopupColor() {
	//Sets text in info box
	browser.tabs.query({ active: true, currentWindow: true }, tabs => {
		let url = tabs[0].url;
		let id = tabs[0].id;
		if (url.startsWith("http:") || url.startsWith("https:")) {
			browser.tabs.executeScript(id, { file: "content_script.js" }).then(info => {
				pp_info_display.innerHTML = info ? info : "An error occurred";
			});
		} else if (url.startsWith("about:home") || url.startsWith("about:newtab")) {
			pp_info_display.innerHTML = "Tab bar color for home page can be configured in settings";
		} else {
			pp_info_display.innerHTML = "This page is protected by browser";
		}
	});
	browser.theme.getCurrent().then(theme => {
		body.style.backgroundColor = theme[`colors`][`popup`];
		body.style.color = theme[`colors`][`popup_text`];
		if (theme[`colors`][`popup_text`] == "rgb(0, 0, 0)") {
			body.classList.add("light");
			body.classList.remove("dark");
		} else {
			body.classList.add("dark");
			body.classList.remove("light");
		}
	});
	if (pref_scheme == "light" || (pref_scheme == "system" && lightModeDetected())) {
		force_mode_caption.innerHTML = "Allow dark tab bar";
		force_mode_caption.parentElement.title = "Allow tab bar to turn dark";
	} else {
		force_mode_caption.innerHTML = "Allow light tab bar";
		force_mode_caption.parentElement.title = "Allow tab bar to turn bright";
	}
} */

/**
 * Updates option page's color depends on color scheme.
 */
/* function autoOptionsColor() {
	if (pref_scheme == "light" || (pref_scheme == "system" && lightModeDetected())) {
		body.classList.add("light");
		body.classList.remove("dark");
		force_mode_caption.innerHTML = "Allow dark tab bar";
		force_mode_caption.parentElement.title = "Allow tab bar to turn dark";
	} else {
		body.classList.add("dark");
		body.classList.remove("light");
		force_mode_caption.innerHTML = "Allow light tab bar";
		force_mode_caption.parentElement.title = "Allow tab bar to turn bright";
	}
} */

/**
 * @returns true if the script is run by the popup
 */
/* function popupDetected() {
	return document.getElementById("more_custom") == null;
}

const light_mode_match_media = window.matchMedia("(prefers-color-scheme: light)");
if (light_mode_match_media != null) light_mode_match_media.onchange = () => {
	if (color_scheme_system.checked) autoOptionsColor();
}; */

/**
 * @returns true if in light mode, false if in dark mode or cannot detect
 */
/* function lightModeDetected() {
	return light_mode_match_media != null && light_mode_match_media.matches;
} */

/**
 * @returns true if Firefox 95.0 or later.
 */
/* function firefoxAboveV95() {
	let str = navigator.userAgent;
	let ind = str.lastIndexOf("Firefox");
	if (ind != -1) {
		str = str.substring(ind + 8);
		return Number(str) >= 95;
	} else {
		return true; //default answer
	}
} */