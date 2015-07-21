import assert from 'assert';
import expect from 'expect';
import { PUSH } from '../Actions';
import createHashHistory from '../createHashHistory';
import describeDOMHistory from './describeDOMHistory';
import execSteps from './execSteps';

describe('hash history', function () {
  afterEach(function () {
    if (window.location.hash !== '')
      window.location.hash = '';
  });

  describeDOMHistory(createHashHistory);

  describe('when the user does not want to persist a state', function() {
    var history, unlisten;
    beforeEach(function () {
      history = createHashHistory({ queryKey: false });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('forgets state across transitions and do not store key in query string', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          history.goBack();
        },
        function (location) {
          history.goForward();
        },
        function (location) {
          expect(location.state).toEqual(null);
          expect(location.search).toEqual('?the=query');
          expect(window.location.hash).toEqual('#/home?the=query');
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('when the user wants to persist a state', function() {
    var location, history, unlisten;
    beforeEach(function () {
      location = null;
      history = createHashHistory({ queryKey: 'a' });
      unlisten = history.listen(function (loc) {
        location = loc;
      });
    });

    afterEach(function () {
      if (unlisten)
        unlisten();
    });

    it('remembers state across transitions and store key in the given query parameter', function (done) {
      var steps = [
        function () {
          history.pushState({ the: 'state' }, '/home?the=query');
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.pathname).toEqual('/home');
          expect(location.search).toEqual('?the=query');
          expect(location.action).toEqual(PUSH);
          expect(window.location.hash).toEqual('#/home?the=query&a=' + location.key);
          history.goBack();
        },
        function () {
          history.goForward();
        },
        function (location) {
          expect(location.state).toEqual({ the: 'state' });
          expect(location.search).toEqual('?the=query');
          expect(window.location.hash).toEqual('#/home?the=query&a=' + location.key);
        }
      ];

      unlisten = history.listen(execSteps(steps, done));
    });
  });

  describe('when the user cancels a POP transition', function () {
    it('puts the URL back');
  });
});
