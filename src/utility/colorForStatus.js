export default function() {
    // 判断订单状态
    switch(arguments[0]) {
        case 'orderStatus':
            return getColorFromOrderStatus(arguments[1]); break;
        case 'stockLockStatus':
            return getColorFromStockLockStatus(arguments[1]); break;
        case 'refundStatus':
            return getColorFromrefundStatus(arguments[1]); break;
        case 'deliveryStatus':
            return getColorFromdeliveryStatus(arguments[1]); break;
        case 'payStatus':
            return getColorFromPayStatus(arguments[1]); break;
        default:
            break;
    }
}
function getColorFromdeliveryStatus(status) {
    switch(status){
        case 10:
        case 20:
        case 30:
            return 'text-warning'; break;
        case 40:
        case 0:
            return 'text-success'; break;
        case 90:
            return 'text-danger'; break;
        case 99:
            return 'text-default'; break;
    }
}
function getColorFromrefundStatus(status) {
    switch(status){
        case 10:
        case 20:
        case 30:
            return 'text-warning'; break;
        case 40:
        case 0:
            return 'text-success'; break;
        case 99:
            return 'text-default'; break;
    }
}
function getColorFromOrderStatus(status) {
    switch(status){
        case 10:
        case 20:
        case 21:
        case 22:
        case 23:
            return 'text-warning'; break;
        case 0:
        case 91:
            return 'text-success'; break;
        case 99:
        case 90:
            return 'text-danger'; break;
    }
}
function getColorFromStockLockStatus(status) {
    switch(status){
        case 10:
        case 20:
        case 30:
            return 'text-warning'; break;
        case 0:
            return 'text-success'; break;
        case 90:
            return 'text-danger'; break;
        case 99:
            return 'text-default'; break;
    }
}
function getColorFromPayStatus(status) {
    switch(status){
        case 10:
        case 20:
        case 30:
            return 'text-warning'; break;
        case 0:
            return 'text-success'; break;
        case 90:
            return 'text-danger'; break;
        case 99:
            return 'text-default'; break;
    }
}