package html5;

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
    	System.out.println("foo: " + foo);
    	System.out.println("bork: " + bork);
    	System.out.println("returning: " + foo.concat(bork));
    	return foo.concat(bork);
    }
    
    @AuraEnabled
    public static Double addValues(@Key("valueA") Double a, @Key("valueB") Double b) throws QuickFixException {
    	System.out.println("a: " + a);
    	System.out.println("b: " + b);
    	System.out.println("returning: " + (a + b));
        return a + b;
    }
    
}
