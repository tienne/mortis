
/*jslint node: true */
'use strict';

var dotenv  = require ( 'dotenv'   ).config(),
    Promise = require ( 'bluebird' ),
    sprintf = require ( 'sprintf'  ),
    mysql   = require ( 'mysql'    ),
    chalk   = require ( 'chalk'    );

// ////////////////////////////////////////////////////////////////////////////
//
// common requirements,

var constant_server_restapi = require ( '../common/constant_server_restapi' );
var protect_agent           = require ( '../services/protect_agent' )();

module.exports = function ( )
{
    var vm = this || {};

    vm._service_name = 'account';

    var api =
    {
        ctor         : ctor
    };

    function ctor ( central_relay, storage_agent, restapi_agent )
    {
        return new Promise ( function ( resolve, reject )
        {
            var retval = false;

            // ////////////////////////////////////////////////////////////////
            //
            // framework resources

            vm.central_relay = central_relay;
            vm.storage_agent = storage_agent;
            vm.restapi_agent = restapi_agent;

            console.log ( chalk.green ( 'on the line :', service_name ( ) ) );

            // ////////////////////////////////////////////////////////////////
            //
            // instance setup

            service_init ( ).then (

                function ( value )
                {

                },
                function ( error )
                {
                    throw ( error );
                }

            ).catch (

                function ( ex )
                {

                }

            ).finally (

                function ( )
                {
                    // ////////////////////////////////////////////////////////////////
                    //
                    // subscriptions
                    //
                    // { none }

                    retval = true;

                    resolve ( retval );
                }

            );

        } );

    }

    function service_name ( )
    {
        return vm._service_name;
    }

    function service_init ( )
    {
        return new Promise ( function ( resolve, reject )
        {
            var express = vm.restapi_agent.express_get ();

            express.post ( '/v1/' + vm._service_name, on_restapi_post );

            resolve ( true );

        } );
    }

    function request_status_send ( res, _status_code, _result )
    {
        return res.status ( _status_code ).send (
        {
            status_code : _status_code,
            result      : _result

        } );
    }

    function sp_exec ( req, res, next, script )
    {
        vm.storage_agent.connection_exec ( script ).then (

            function ( value )
            {
                return request_status_send ( res, 200, value );
            },
            function ( error )
            {
                throw ( error );
            }

        ).catch (

            function ( error )
            {
                return request_status_send ( res, 400, error );
            }

        );
    }

    /**
     *
     * @param req.body.accountId
     */
    function fetch ( req, res, next )
    {
        var sp_script = sprintf ( 'CALL %s( %s, %s, %s );',
            'sp_account_fetch',
            mysql.escape ( req.body.accountId )
        );

        return sp_exec ( req, res, next, sp_script );
    }

    /**
     *
     * @param req.body.accountId
     * @param req.body.userName
     * @param req.body.salt
     * @param req.body.hash
     */
    function patch ( req, res, next )
    {
        var sp_script = sprintf ( 'CALL %s( %s, %s, %s, %s );',
            'sp_account_patch',
            mysql.escape ( req.body.accountId ),
            mysql.escape ( req.body.userName ),
            mysql.escape ( req.body.salt ),
            mysql.escape ( req.body.hash )
        );

        return sp_exec ( req, res, next, sp_script );
    }

    /**
     *
     * @param req.body.userName
     * @param req.body.password
     */
    function write ( req, res, next )
    {
        var account_salt = protect_agent.compose_salt ( );
        var account_hash = protect_agent.encrypt_pass ( req.body.password, account_salt );

        var sp_script = sprintf ( 'CALL %s( %s, %s, %s );',
            'sp_account_write',
            mysql.escape ( req.body.userName ),
            mysql.escape ( account_salt ),
            mysql.escape ( account_hash )
        );

        return sp_exec ( req, res, next, sp_script );
    }

    function on_restapi_post ( req, res, next )
    {
        if ( req.body.fetch ) return fetch ( req, res, next );

        if ( req.body.patch ) return patch ( req, res, next );

        if ( req.body.write ) return write ( req, res, next );

        return request_status_send ( res, 400, { error : 'bad request' } );
    }

    return api;

};