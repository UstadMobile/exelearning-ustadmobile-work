/**
 * List compiled by mystix on the extjs.com forums.
 * Thank you Mystix!
 *
 * English Translations
 * updated to 2.2 by Condor (8 Aug 2008)
 */
Ext.onReady(function() {

    if (Ext.data && Ext.data.Types) {
        Ext.data.Types.stripRe = /[\$,%]/g;
    }

     if(Ext.Date) {
        Ext.Date.shortMonthNames = [
            "جانفي",
            "فيفري",
            "مارس",
            "أفريل",
            "ماي",
            "جوان",
            "جويلية",
            "أوت",
            "سبتمبر",
            "أكتوبر",
            "نوفيمبر",
            "ديسمبر"
        ];

    Ext.Date.getShortMonthName = function(month) {
        return Ext.Date.shortMonthNames[month];
    };
                                    
  Ext.Date.monthNames = [
    "جانفي",
    "فيفري",
    "مارس",
    "أفريل",
    "ماي",
    "جوان",
    "جويلية",
    "أوت",
    "سبتمبر",
    "أكتوبر",
    "نوفيمبر",
    "ديسمبر"
  ];
  
  Ext.Date.monthNumbers = {
    "جانفي": 0,
    "فيفري": 1,
    "مارس": 2,
    "أفريل": 3,
    "ماي": 4,
    "جوان": 5,
    "جويلية": 6,
    "أوت": 7,
    "سبتمبر": 8,
    "أكتوبر": 9,
    "نوفيمبر": 10,
    "ديسمبر": 11
  };
  
  Ext.Date.getMonthNumber = function(name) {
   return Ext.Date.monthNumbers[Ext.util.Format.capitalize(name)];
  };
  
  Ext.Date.dayNames = [
    "أحد",
    "أثنين",
    "ثلاثاء",
    "أربعاء",
    "خميس",
    "جمعة",
    "سبت"
  ];
  
  Ext.Date.getShortDayName = function(day) {
    return Ext.Date.dayNames[day].substring(0, 3);
  };
  
  Ext.Date.parseCodes.S.s = "(?:st|nd|rd|th)";
 
 }
    if (Ext.util && Ext.util.Format) {
        Ext.apply(Ext.util.Format, {
            thousandSeparator: ',',
            decimalSeparator: '.',
            currencySign: '$',
            dateFormat: 'm/d/Y'
        });
    }
});

Ext.define("Ext.locale.en.data.validator.Bound", {
    override: "Ext.data.validator.Bound",
    emptyMessage: "Must be present"
});

Ext.define("Ext.locale.en.data.validator.Email", {
    override: "Ext.data.validator.Email",
    message: "Is not a valid email address"
});

Ext.define("Ext.locale.en.data.validator.Exclusion", {
    override: "Ext.data.validator.Exclusion",
    message: "Is a value that has been excluded"
});

Ext.define("Ext.locale.en.data.validator.Format", {
    override: "Ext.data.validator.Format",
    message: "Is in the wrong format"
});

Ext.define("Ext.locale.en.data.validator.Inclusion", {
    override: "Ext.data.validator.Inclusion",
    message: "Is not in the list of acceptable values"
});

Ext.define("Ext.locale.en.data.validator.Length", {
    override: "Ext.data.validator.Length",
    minOnlyMessage: "Length must be at least {0}",
    maxOnlyMessage: "Length must be no more than {0}",
    bothMessage: "Length must be between {0} and {1}"
});

Ext.define("Ext.locale.en.data.validator.Presence", {
    override: "Ext.data.validator.Presence",
    message: "Must be present"
});

Ext.define("Ext.locale.en.data.validator.Range", {
    override: "Ext.data.validator.Range",
    minOnlyMessage: "Must be must be at least {0}",
    maxOnlyMessage: "Must be no more than than {0}",
    bothMessage: "Must be between {0} and {1}",
    nanMessage: "Must be numeric"
});

Ext.define("Ext.locale.en.view.View", {
    override: "Ext.view.View",
    emptyText: ""
});

Ext.define("Ext.locale.en.grid.plugin.DragDrop", {
    override: "Ext.grid.plugin.DragDrop",
    dragText: "{0} selected row{1}"
});

// changing the msg text below will affect the LoadMask
Ext.define("Ext.locale.en.view.AbstractView", {
    override: "Ext.view.AbstractView",
    loadingText: "...يرجى الأنتظار"
});

Ext.define("Ext.locale.en.picker.Date", {
    override: "Ext.picker.Date",
    todayText         : "اليوم",
    minText           : "هذا التاريخ قبل أقل تاريخ مسموح به",
    maxText           : "هذا التاريخ بعد أكبر تاريخ مسموح به",
    disabledDaysText  : "",
    disabledDatesText : "",
    nextText          : 'الشهر القادك (Control+Right)',
    prevText          : 'الشهر السابق (Control+Left)',
    monthYearText     : 'أختر الشهر (Control+Up/Down to move years)',
    todayTip          : "{0} (Spacebar)",
    format            : "d/m/y",
    startDay          : 0
});

Ext.define("Ext.locale.en.picker.Month", {
    override: "Ext.picker.Month",
    okText            : "&#160;OK&#160;",
    cancelText        : "ألغاء",
});

Ext.define("Ext.locale.en.toolbar.Paging", {
    override: "Ext.PagingToolbar",
    beforePageText : "صفحة",
     afterPageText  : "{0} من",
     firstText      : "الأولى",
     prevText       : "الصفحة السابقة",
     nextText       : "الصفحة التالية",
     lastText       : "الأخيرة",
     refreshText    : "تحديث",
     displayMsg     : "{2} يعرض {0} - {1} من",
     emptyMsg       : 'لا يوجد تاريخ لعرضه'
});

Ext.define("Ext.locale.en.form.Basic", {
    override: "Ext.form.Basic",
    waitTitle: "...يرجى الأنتظار"
});

Ext.define("Ext.locale.en.form.field.Base", {
    override: "Ext.form.field.Base",
    invalidText: "القيمة بهذا الحقل غير صحيحة"
});

Ext.define("Ext.locale.en.form.field.Text", {
    override: "Ext.form.field.Text",
    minLengthText : "{0} الحد الأقصى لهذا الحقل هو",
     maxLengthText : "{0} الحد الأدنى لهذا الحقل هو",
     blankText     : "هذا الحقل مطلوب",
     regexText     : "",
     emptyText     : null
});

Ext.define("Ext.locale.en.form.field.Number", {
    override: "Ext.form.field.Number",
    decimalPrecision: 2,
    minText : "{0} أعلى قيمة بهذا الحصل هي",
     maxText : "{0} أقل قيمة بهذا الحقل هي",
     nanText : "{0} هذا الرقم غير صحيح"
});

Ext.define("Ext.locale.en.form.field.Date", {
    override: "Ext.form.field.Date",
    disabledDaysText  : "معطل",
     disabledDatesText : "معطل",
     minText           : "{0} التاريخ بهذا الحقل يجب ان يكون بعد",
     maxText           : "{0} التاريخ بهذا الحقل يجب ان يكون قبل",
     invalidText       : "{0} {1} هذا التاريح غير صحيح - يجب أن يكون بهذه الصيغة",
     format            : "d/m/y",
     altFormats        : "d/m/Y|d-m-y|d-m-Y|d/m|d-m|dm|dmy|dmY|d|Y-m-d"
});

Ext.define("Ext.locale.en.form.field.ComboBox", {
    override: "Ext.form.field.ComboBox",
    valueNotFoundText: undefined
}, function() {
    Ext.apply(Ext.form.field.ComboBox.prototype.defaultListConfig, {
        loadingText: "...يرجى الأنتظار"
    });
});

Ext.define("Ext.locale.en.form.field.VTypes", {
    override: "Ext.form.field.VTypes",
    emailText    : '"user@example.com" هذا الحقل يجب ان تكون بريد ألكتروني بهذه الصيغة',
     urlText      : '"http:/'+'/www.example.com" هذا الحقل يجب ان يحتوي على رابط موقع وبهذه الصيغة',
     alphaText    : '_ هذا الحقل يجب ان يحتوي على احرف ورمز الشرطة التحتية',
     alphanumText : '_ هذا الحقل يجب ان يحتوي على احرف وأرقام ورمز الشرطة التحتية'
});

Ext.define("Ext.locale.en.form.field.HtmlEditor", {
    override: "Ext.form.field.HtmlEditor",
    createLinkText : ':يرجى ادخال الرابط',
}, function() {
    Ext.apply(Ext.form.field.HtmlEditor.prototype, {
        buttonTips: {
            bold : {
             title: 'سميك (Ctrl+B)',
             text: '.أجعل النص المحدد سميك',
             cls: 'x-html-editor-tip'
           },
           italic : {
             title: 'مائل (Ctrl+I)',
             text: '.أجعل النص المحدد مائل',
             cls: 'x-html-editor-tip'
           },
           underline : {
             title: 'خط تحتي (Ctrl+U)',
             text: '.ضع خط تحت النص المحدد',
             cls: 'x-html-editor-tip'
           },
           increasefontsize : {
             title: 'تكبير',
             text: 'زيادة حجم الخط.',
             cls: 'x-html-editor-tip'
           },
           decreasefontsize : {
             title: 'تصغير',
             text: '.تقليل حجم الخط',
             cls: 'x-html-editor-tip'
           },
           backcolor : {
             title: 'لون خلفية',
             text: '.تغيير لون خلفية النص المحدد',
             cls: 'x-html-editor-tip'
           },
           forecolor : {
             title: 'لون الخط',
             text: '.تغيير لون النص المحدد',
             cls: 'x-html-editor-tip'
           },
           justifyleft : {
             title: 'محازاة لليسار',
             text: '.محازاة النص لليسار',
             cls: 'x-html-editor-tip'
           },
           justifycenter : {
             title: 'توصيط النص',
             text: 'توسط النص المحدد.',
             cls: 'x-html-editor-tip'
           },
           justifyright : {
             title: 'محازاة لليمين',
             text: '.محازاة النص المحدد لليمين',
             cls: 'x-html-editor-tip'
           },
           insertunorderedlist : {
             title: 'قائمة كرات',
             text: '.أبدأ قائمة كرات',
             cls: 'x-html-editor-tip'
           },
           insertorderedlist : {
             title: 'قائمة أرقام',
             text: '.أبدا قائمة أرقام',
             cls: 'x-html-editor-tip'
           },
           createlink : {
             title: 'رابط تشعبي',
             text: '.أجعل النص المحدد رابط تشعبي',
             cls: 'x-html-editor-tip'
           },
           sourceedit : {
             title: 'تحرير المصدر',
             text: '.أنتقل لتحرير كود المصدر',
             cls: 'x-html-editor-tip'
           }
        }
    });
});

Ext.define("Ext.locale.en.grid.header.Container", {
    override: "Ext.grid.header.Container",
    sortAscText  : "فرز تصاعدي",
     sortDescText : "فرز تنازلي",
     columnsText  : "أعمدة"
});

Ext.define("Ext.locale.en.grid.GroupingFeature", {
    override: "Ext.grid.feature.Grouping",
    emptyGroupText : '(لا شيء)',
     groupByText    : 'تحميع بدلالة هذا العمود',
     showGroupsText : 'أعرض كمجموعات'
});

Ext.define("Ext.locale.en.grid.PropertyColumnModel", {
    override: "Ext.grid.PropertyColumnModel",
    nameText   : "صفة",
    valueText  : "قيمة",
    dateFormat : "d/m/Y",
    trueText   : "صحيح",
    falseText  : "غير صحيح"
});

Ext.define("Ext.locale.en.grid.BooleanColumn", {
    override: "Ext.grid.BooleanColumn",
    trueText: "صحيح",
    falseText: "غير صحيح",
    undefinedText: '&#160;'
});

Ext.define("Ext.locale.en.grid.NumberColumn", {
    override: "Ext.grid.NumberColumn",
    format: '0,000.00'
});

Ext.define("Ext.locale.en.grid.DateColumn", {
    override: "Ext.grid.DateColumn",
    format: 'm/d/Y'
});

Ext.define("Ext.locale.en.form.field.Time", {
    override: "Ext.form.field.Time",
    minText : "{0} الوقت بهذا الحقل يجب ان يكون أكبر من أو يساوي",
     maxText : "{0} الوقت بهذا الحقل يجب ان يكون أقل من أو يساوي",
     invalidText : "{0} ليست تنسيق صحيح للوقت",
     format : "g:i A",
     altFormats : "g:ia|g:iA|g:i a|g:i A|h:i|g:i|H:i|ga|ha|gA|h a|g a|g A|gi|hi|gia|hia|g|H"
});

Ext.define("Ext.locale.en.form.field.File", {
    override: "Ext.form.field.File",
    buttonText: "Browse..."
});

Ext.define("Ext.locale.en.form.CheckboxGroup", {
    override: "Ext.form.CheckboxGroup",
    blankText: "يجب تحديد عنصر واحد على الأقل في هذه المجموعة"
});

Ext.define("Ext.locale.en.form.RadioGroup", {
    override: "Ext.form.RadioGroup",
    blankText: "يجب تحديد عنصر واحد في هذه المجموعة"
});

Ext.define("Ext.locale.en.window.MessageBox", {
    override: "Ext.window.MessageBox",
    buttonText: {
        ok     : "موافق",
        cancel : "الغاء",
        yes    : "نعم",
        no     : "لا"
    }    
});

Ext.define("Ext.locale.en.grid.filters.Filters", {
    override: "Ext.grid.filters.Filters",
    menuFilterText: "Filters"
});

Ext.define("Ext.locale.en.grid.filters.filter.Boolean", {
    override: "Ext.grid.filters.filter.Boolean",
    yesText: "نعم",
    noText: "لا"
});

Ext.define("Ext.locale.en.grid.filters.filter.Date", {
    override: "Ext.grid.filters.filter.Date",
    fields: {
        lt: {text: 'Before'},
        gt: {text: 'After'},
        eq: {text: 'On'}
    },
    // Defaults to Ext.Date.defaultFormat
    dateFormat: null
});

Ext.define("Ext.locale.en.grid.filters.filter.List", {
    override: "Ext.grid.filters.filter.List",
    loadingText: "...يرجى الأنتظار"
});

Ext.define("Ext.locale.en.grid.filters.filter.Number", {
    override: "Ext.grid.filters.filter.Number",
    emptyText: "..أدخل رقم"
});

Ext.define("Ext.locale.en.grid.filters.filter.String", {
    override: "Ext.grid.filters.filter.String",
    emptyText: "..أدخل النص فلتر"
});

// This is needed until we can refactor all of the locales into individual files
Ext.define("Ext.locale.en.Component", { 
    override: "Ext.Component"
});
