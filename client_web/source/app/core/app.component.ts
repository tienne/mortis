
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import {Observable} from "rxjs/Observable";
import {BehaviorSubject} from "rxjs/Rx";

const windowSize$ = new BehaviorSubject( getWindowSize() );

function getWindowSize ( )
{
    let retval =
    {
        height : window.innerHeight,
        width  : window.innerWidth
    };

    return retval;
}

@Component (
{
    moduleId        : module.id,
    selector        : 'app-root',
    templateUrl     : 'app.component.html',
    styleUrls       : ['app.component.scss'],
    encapsulation   : ViewEncapsulation.None,
} )
export class AppComponent implements OnInit
{
    name:                   string;
    nav_center_left_size:   string;
    nav_center_left_flex:   string;
    private initWinHeight:  number  = 0;

    show_nav_center_left:   boolean = true;
    show_nav_center_side:   boolean = false;
 // show_nav_center_side:   boolean = true;


    nav_center_left_mini:   string  = `48px`;
    nav_center_left_open:   string  = `280px`;


    nav_center_left_width:  string  = this.nav_center_left_mini;
    nav_center_side_width:  string  = this.nav_center_left_mini;

    listof_menu_item:       any[]   = [];

    logout_menu_item:       any     =
    {
        id   : -1,
        icon : `power_settings_new`,
        name : `logout`
    };

    constructor ( )
    {
    }

    ngOnInit ( ) : void
    {
        console.log ( 'ngOnInit AppComponent' );

        this.name = 'Mortis';

        Observable
            .fromEvent ( window, 'resize' )
            .debounceTime ( 200 )
            .subscribe( ( event ) =>
            {
                this.resizeFn ( event );
            } );

        this.initWinHeight = window.innerHeight;

        this.init_listof_menu_item ( );

        this.resizeFn ( null );
    }

    on_event_toggle_nav ( nav_event: any ) : void
    {
        this.show_nav_center_left = true;
        this.show_nav_center_side = false;

        this.toggle_nav_center_left_width ( );
    }

    on_select_nav_center_left ( menu_item: any ) : void
    {
        // this.show_nav_center_left  = false;
        // this.nav_center_left_width = this.nav_center_left_mini;

        console.log ( menu_item.name );
    }

    on_select_nav_center_side ( ) : void
    {
        this.show_nav_center_side  = false;
        this.nav_center_side_width = this.nav_center_left_mini;
    }

    toggle_nav_center_left_width ( ) : void
    {
        if ( this.nav_center_left_open === this.nav_center_left_width )
        {
            this.nav_center_left_width = this.nav_center_left_mini;

        } else
        {
            this.nav_center_left_width = this.nav_center_left_open;
        }
    }

    init_listof_menu_item ( ) : void
    {
        this.listof_menu_item.push (

            {
                id   : 1,
                icon : `dashboard`,
                name : `Home`
            },
            {
                id   : 2,
                icon : `mail`,
                name : `Messages`
            },
            {
                id   : 3,
                icon : `flag`,
                name : `Audit`
            },
            {
                id   : 4,
                icon : `settings`,
                name : `Settings`
            },

        );
    }

    on_select_nav_logout ( menu_item: any ) : void
    {
        console.log ( menu_item.name );
    }

    private resizeFn ( e: any )
    {
        let left_height_size: number = e ? e.target.innerHeight : this.initWinHeight;

        left_height_size -= 48; // minus the top nav
        left_height_size -= 24; // minus the footer

        if ( 1 > left_height_size ) left_height_size = 240;

        this.nav_center_left_size = `${left_height_size}px`;

        let left_height_flex = left_height_size;

        left_height_flex -= 48; // minus the dashboard
        left_height_flex -= 48; // minus the messages
        left_height_flex -= 48; // minus the flag
        left_height_flex -= 48; // minus the settings
        left_height_flex -= 48; // minus the logout / power

        this.nav_center_left_flex = `${left_height_flex}px`;
    }

}