<?php

function clean($s)
{
    return preg_replace('/[^\p{L}\p{N}\s]/u', '', $s);
}
echo "   this is/some'garbage-230n?  ";
echo trim(clean("   <this is/some'garbage-230n?  "));
