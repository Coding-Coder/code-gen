/**
 * 所有组件的接口,后面的组件都要实现这个类
 * 提供hide(),show()两个方法
 * @class
 */
var FDControl = FDLib.createInterface([
	'hide'
	,'show'
]);

/**
 * @private
 */
FDControl.controlCount = 0;

/**
 * 生成组件唯一标识
 * @return 返回唯一标识
 */
FDControl.generateCount = function() {
	return FDControl.controlCount++;
}
