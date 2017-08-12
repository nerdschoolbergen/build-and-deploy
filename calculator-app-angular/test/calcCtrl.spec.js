describe('the calculation controller', function () {
  var $controller;

  beforeEach(module('calcApp'));

  beforeEach(inject(function (_$controller_) {
    $controller = _$controller_;
  }));

  function createController() {
    return $controller('calcCtrl', []);
  }

  it('exists', function () {
    var ctrl = createController();
    expect(ctrl).toBeDefined();
  });

  describe('initialization', function () {
    it('should set result to empty string', function () {
      var ctrl = createController();
      expect(ctrl.result).toBe('');
    });

    it('should set oper to plus', function () {
      var ctrl = createController();
      expect(ctrl.oper).toBe('plus');
    });

    it('should contain calculate method', function () {
      var ctrl = createController();
      expect(ctrl.calculate).toBeDefined();
      expect(typeof ctrl.calculate).toBe('function');
    });
  });

  describe('the calculate method', function () {
    describe('plus operator', function () {
      var operator = 'plus';

      it('should calculate 2 + 2 = 4', function () {
        var ctrl = createController();
        ctrl.calculate(2, 2, operator);

        expect(ctrl.result).toBe(4);
      });

      it('should calculate 0 + 0 = 0', function () {
        var ctrl = createController();
        ctrl.calculate(0, 0, operator);

        expect(ctrl.result).toBe(0);
      });

      it('should calculate 0 + 7 = 7', function () {
        var ctrl = createController();
        ctrl.calculate(0, 7, operator);

        expect(ctrl.result).toBe(7);
      });

      it('should calculate 123 + 34 = 157', function () {
        var ctrl = createController();
        ctrl.calculate(123, 34, operator);

        expect(ctrl.result).toBe(157);
      });

      it('should calculate -3 + -7 = -10', function () {
        var ctrl = createController();
        ctrl.calculate(-3, -7, operator);

        expect(ctrl.result).toBe(-10);
      });

      it('should calculate -6 + 2 = -4', function () {
        var ctrl = createController();
        ctrl.calculate(-6, 2, operator);

        expect(ctrl.result).toBe(-4);
      });
    });

    /*describe('minus operator', function () {
      var operator = 'minus';

      it('should calculate 2 - 2 = 0', function () {
        var ctrl = createController();
        ctrl.calculate(2, 2, operator);

        expect(ctrl.result).toBe(0);
      });

      it('should calculate 10 - 4 = 6', function () {
        var ctrl = createController();
        ctrl.calculate(10, 4, operator);

        expect(ctrl.result).toBe(6);
      });

      it('should calculate 15 - -5 = 20', function () {
        var ctrl = createController();
        ctrl.calculate(15, -5, operator);

        expect(ctrl.result).toBe(20);
      });

      it('should calculate -100 - -20 = -80', function () {
        var ctrl = createController();
        ctrl.calculate(-100, -20, operator);

        expect(ctrl.result).toBe(-80);
      });

      it('should calculate 1 - 7 = -6', function () {
        var ctrl = createController();
        ctrl.calculate(1, 7, operator);

        expect(ctrl.result).toBe(-6);
      });

      it('should calculate 10 - 0 = 10', function () {
        var ctrl = createController();
        ctrl.calculate(10, 0, operator);

        expect(ctrl.result).toBe(10);
      });
    });*/

    describe('divide operator', function () {
      var operator = 'divide';

      it('should calculate 2 / 2 = 1', function () {
        var ctrl = createController();
        ctrl.calculate(2, 2, operator);

        expect(ctrl.result).toBe(1);
      });

      it('should calculate 10 / 4 = 2.5', function () {
        var ctrl = createController();
        ctrl.calculate(10, 4, operator);

        expect(ctrl.result).toBe(2.5);
      });

      it('should calculate 15 / -5 = -3', function () {
        var ctrl = createController();
        ctrl.calculate(15, -5, operator);

        expect(ctrl.result).toBe(-3);
      });

      it('should calculate -100 / -20 = 5', function () {
        var ctrl = createController();
        ctrl.calculate(-100, -20, operator);

        expect(ctrl.result).toBe(5);
      });

      it('should calculate 30 / 1 = 30', function () {
        var ctrl = createController();
        ctrl.calculate(30, 1, operator);

        expect(ctrl.result).toBe(30);
      });

      it('should show divide by zero error for 10 / 0', function () {
        var ctrl = createController();
        ctrl.calculate(10, 0, operator);

        expect(ctrl.result).toBe('Cannot divide by zero');
      });
    });

    describe('multiply operator', function(){
      var operator = 'multiply';

      it('should not be implemented', function(){
        var ctrl = createController();
        ctrl.calculate(10, 10, operator);

        expect(ctrl.result).toBe('Operator not implemented');
      });
    });

    it('undefined operator should not be implemented', function(){
      var ctrl = createController();
      ctrl.calculate(10, 10, undefined);

      expect(ctrl.result).toBe('Operator not implemented');
    });

    it('null operator should not be implemented', function(){
      var ctrl = createController();
      ctrl.calculate(10, 10, null);

      expect(ctrl.result).toBe('Operator not implemented');
    });

    it('unknown operator should not be implemented', function(){
      var ctrl = createController();
      ctrl.calculate(10, 10, 'unknown');

      expect(ctrl.result).toBe('Operator not implemented');
    });

    it('square operator should not be implemented', function(){
      var ctrl = createController();
      ctrl.calculate(10, 10, 'square');

      expect(ctrl.result).toBe('Operator not implemented');
    });
  });
});
