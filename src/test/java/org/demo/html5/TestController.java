package org.demo.html5;

import java.util.Map;

import org.auraframework.Aura;
import org.auraframework.def.ComponentDef;
import org.auraframework.def.DefDescriptor.DefType;
import org.auraframework.instance.Component;
import org.auraframework.system.Annotations.AuraEnabled;
import org.auraframework.system.Annotations.Controller;
import org.auraframework.system.Annotations.Key;
import org.auraframework.throwable.quickfix.QuickFixException;

@Controller
public class TestController {

    @AuraEnabled
    public static String testServerAction(@Key("foo") String foo, @Key("bork") String bork) throws QuickFixException {
        return foo.concat(bork);
    }
}
