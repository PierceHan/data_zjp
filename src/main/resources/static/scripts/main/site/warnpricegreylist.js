
var pageVar = {
    tablefirst: 1,
    tableRolefirst: 1,
    initTableDate: function (data) {
        debugger;
        var ajaxData1 = data || {
            "data": []
        };
        var table = document.querySelector('table[grid-manager="greyListModels"]');

        table.GM('init', {
            supportRemind: true
            , height: 'auto'
            , i18n: 'zh-cn'
            , textConfig: {
                'page-go': {
                    'zh-cn': '跳转',
                    'en-us': 'Go '
                }
            }
            , supportSetTop: false
            , gridManagerName: 'greyListModels'
            , disableCache: true  //是否禁用记忆功能
            , disableOrder: false
            , supportSorting: true
            , supportCheckbox: false  //是否禁用全选
            , supportDrag: true
            , supportAjaxPage: true
            , supportAutoOrder: false
            , emptyTemplate: '<div class="gm-emptyTemplate">什么也没有</div>'
            , ajax_data: ajaxData1
            , isCombSorting: false
            , pageSize: 20
            , columnData: [{
                key: 'orderId',
                width: '80px',
                align: 'center',
                text: '订单ID'
            }, {
                key: 'uid',
                width: '80px',
                align: 'center',
                text: '用户ID'
            }, {
                key: 'roomId',
                width: '80px',
                align: 'center',
                text: '房型ID'
            }, {
                key: 'source',
                width: '80px',
                align: 'center',
                text: '来源'
            }, {
                key: 'effectDate',
                width: '80px',
                align: 'center',
                text: '日期'
            }, {
                key: 'minPrice',
                width: '80px',
                align: 'center',
                text: '最低价格'
            }, {
                key: 'maxPrice',
                width: '80px',
                align: 'center',
                text: '最高价格'
            }, {
                key: 'insertTime',
                width: '80px',
                align: 'center',
                text: '插入时间'
            }]

            , pagingBefore: function (query) {
                console.log('Event: 分页前', query);
            }
            , pagingAfter: function (query) {
                pageVar.loadData(query.cPage);
            }
            , sortingBefore: function (query) {
                console.log('Event: 排序前', query);
            }
            , sortingAfter: function (query) {
                console.log('Event: 排序后', query);
            }
            , ajax_success: function (data) {
                console.log('Event: ajax_success', data);
            }
        }, function (query) {
            // 渲染完成后的回调函数
            console.log(query);
        });
    },
    loadData: function (page) {
        debugger;
        var self = this,
            obj = $('table[grid-manager]'),
            id_search = $("#J_UserNumber").val() || '',
            container = $("#ajax-content .charts_box");

        new Tool().showStatus(container, 'loading');
        self.request("detaillist", {
            id_search: id_search,
            PageIndex: page || 1,
        }, function (data) {
            var ret = data.result;
            if (!ret) return;

            if (pageVar.tablefirst) {
                pageVar.tablefirst = false;
                pageVar.initTableDate({"data": ret["greyListModels"], "totals": ret["total"]});
                pageVar.initTableDate({"data": ret["greyListModels"], "totals": ret["total"]});
            } else {
                var table = document.querySelector('table[grid-manager="greyListModels"]');
               table.GM('setAjaxData', {"data": ret["greyListModels"], "totals": ret["total"]});
            }

            container.find('.loading').remove();
        }, function (data) {
            var table = document.querySelector('table[grid-manager="greyListModels"]');
            table.GM('setAjaxData', {"data": ret["greyListModels"], "totals": ret["total"]});
        })
    },
    loadSystemList: function (uid) {
        $('#selSystemID').empty();

        var self = this;
        $.ajax({
            type: "post",
            dataType: "json",
            // url: 'permission/permission/system/list',
            url: 'warnPrice/warnpricegreylist/detaillist',
            success: function (data) {
                if (data.code == 'A0001') {
                    if (data.result && data.result.systemList) {
                        var html = '';
                        $.each(data.result.systemList, function (k, v) {
                            html += '<option value="' + v.systemID + '">' + v.systemName + '</option>'
                        })
                        $('#selSystemID').append(html)
                        $('#selSystemID').val('7').trigger('change');
                        self.LoadUserPermission(uid)
                    }
                }
            },
            error: function (data) {
                console.log('ERR----', data);
            },
            complete: function () {
                $(window).trigger('resize');
            }
        });
    },


    /**
     * 统一请求
     *
     */
    request: function (action,data, success, error) {
        debugger;
        var self = this,
            $ = jQuery;
        $.ajax({
            type: "post",
            dataType: "json",
            // url: 'permission/user/' + action,
            url: '/warnPrice/warnpricegreylist/detaillist',
            data: data,

            success: function (data) {
                if (data.code == 'A0001') {
                    success && success(data);
                } else {
                    error && error(data);
                }
            },
            error: function (data) {
                console.log('ERR----', data);
                error && error(data);
            },
            complete: function () {
                $(window).trigger('resize');
            }
        });
    },
    requestJson: function (action, data, success, error) {
        var self = this,
            $ = jQuery;
        $.ajax({
            type: "post",
            dataType: "json",
            processData: false,
            contentType: "application/json; charset=utf-8",
            // url: '/permission/user/' + action,
            url: 'warnPrice/warnpricegreylist/detaillist',
            data: JSON.stringify(data),
            success: function (data) {
                if (data.code == 'A0001') {
                    success && success(data);
                } else {
                    error && error(data);
                }
            },
            error: function (data) {
                console.log('ERR----', data);
                error && error(data);
            },
            complete: function () {
                $(window).trigger('resize');
            }
        });
    }
};

$(function () {
    pageVar.loadData();

    $('#J_UserNumber').bind("keypress", function (event) {
        if (event.keyCode == 13) {
            pageVar.loadData();
        }
    })
    $('[js-click="searchBtn"]').click(function () {
        pageVar.loadData();
    })

});